(function(exports) {
  var config = {
    'performance': false,
    'debug': false,
    'original-ui': false
  }

  exports.Config = {
    get performance() {
      return config.performance
    },
    get debug() {
      return config.debug
    },
    get originalUI() {
      return config['original-ui']
    },
    set originalUI(value) {
      config['original-ui'] = value
    }
  };
}(this));
