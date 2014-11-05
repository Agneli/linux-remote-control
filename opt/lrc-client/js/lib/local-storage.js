/**
 * Helper to stock an array of JSON objects to localStorage
 */
function Local_Storage() {
    this.localStorage_key = '';
}

/**
 * Returns the currently stored array
 */
Local_Storage.prototype.all = function() {
    return jQuery.parseJSON(localStorage.getItem(this.localStorage_key) || '[]');
};

/**
 * Overrides the current stored array with a new one
 */
Local_Storage.prototype.save = function(object) {
    localStorage.setItem(this.localStorage_key, JSON.stringify(object));
};

/**
 * Removes an element from the array
 */
Local_Storage.prototype.remove = function(index) {
    var custom_commands = this.all();

    custom_commands.splice(index, 1);

    this.save(custom_commands);
};

/**
 * Appends an element to the current array
 */
Local_Storage.prototype.append = function(object) {
    var current_array = this.all();

    current_array.push(object);

    this.save(current_array);
    console.log(object);
};
