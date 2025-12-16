// BMI Calculator Function with Supabase Save
if (document.getElementById('bmiForm')) {
  document.getElementById('bmiForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100;
    const bmi = (weight / (height * height)).toFixed(2);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    // Display result
    document.getElementById('bmiResult').innerText = `Your BMI is ${bmi} (${category})`;
    
    // ✅ SUPABASE DATABASE SAVE CODE
    try {
      // Check if Supabase is available
      if (typeof supabase === 'undefined') {
        console.warn('Supabase not loaded. Result not saved to database.');
        return;
      }
      
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare data for database
      const bmiData = {
        weight: weight,
        height: height * 100, // Convert back to cm for storage
        bmi_value: parseFloat(bmi),
        category: category.toLowerCase().replace(' ', '_') // 'normal_weight' format
      };
      
      // Add user_id only if user is logged in
      if (user) {
        bmiData.user_id = user.id;
      }
      
      // Save to Supabase database
      const { data, error } = await supabase
        .from('bmi_results')
        .insert([bmiData]);
      
      if (error) {
        console.error('Database save error:', error);
        // Optional: Show save failure message
        document.getElementById('bmiResult').innerText += '\n(Result not saved to history)';
      } else {
        console.log('BMI saved to database:', data);
        // Optional: Show success message
        document.getElementById('bmiResult').innerText += '\n✓ Saved to your history';
      }
      
    } catch (err) {
      console.error('Error saving BMI:', err);
    }
  });
}

// ✅ ADD THIS CODE TO SUPPRESS THE WARNING (Optional)
(function() {
  // Temporarily suppress the deprecated event warning
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    // Skip the deprecated event type
    if (type === 'DOMNodeInsertedIntoDocument' || 
        type === 'DOMNodeInserted' || 
        type === 'DOMNodeRemoved') {
      // Optional: uncomment to see what's trying to add this
      // console.trace('Deprecated event blocked:', type);
      return;
    }
    
    // Call original method for other events
    return originalAddEventListener.call(this, type, listener, options);
  };
})();

// ✅ ALTERNATIVE: Use MutationObserver instead (Modern Approach)
if (typeof MutationObserver !== 'undefined') {
  // Set up a mutation observer to handle DOM changes
  const observer = new MutationObserver(function(mutations) {
    // Handle DOM insertions if needed
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Nodes were added to the DOM
        // console.log('Nodes added:', mutation.addedNodes);
      }
    });
  });
  
  // Start observing when document is ready
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}