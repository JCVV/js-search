export default {
    /**
     * Creates and returns a new debounced version of the passed function 
     * which will postpone its execution until after wait milliseconds 
     * have elapsed since the last time it was invoked.
     * @param {Function} func function to debounce
     * @param {Number} wait 
     * @param {Boolean} immediate 
     */
    debounce: function (func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}