(function (module) {
    var grunt = require('grunt'),
        growl = require('growl'),
        Buffer = require('buffer').Buffer;

    function notify(obj, title) {
        if (obj) {
            var message = Buffer.isBuffer(obj) ? obj.toString() : (obj.message || obj);
            var msg = grunt.log.uncolor(message);

            if (msg.length > 0) {
                growl(msg, {
                    title: title,
                    image: 'Console'
                });
            }
        }
    }

// add a hook to grunt.fail.warn(), grunt.fail.fatal()
    ['warn', 'fatal'].forEach(function (level) {
        grunt.util.hooker.hook(grunt.fail, level, function(obj) {
            notify(obj);
        });
    });

// add a hook to grunt.log.warn(), grunt.log.error()
    ['warn', 'error'].forEach(function (level) {
        grunt.util.hooker.hook(grunt.log, level, function(obj) {
            notify(obj, level);
        });
    });

// add a hook to grunt.warn()
    grunt.util.hooker.hook(grunt, 'warn', function(obj) {
        notify(obj, 'warn');
    });

// add a hook to process.stderr.write()
    grunt.util.hooker.hook(process.stderr, 'write', function(obj) {
        var messages = grunt.log.uncolor((Buffer.isBuffer(obj) ? obj.toString() : (obj.message || obj))).split('\n');
        messages.forEach(function (message) {
            notify(message, 'stderr');
        });
    });

// add a hook to process.stdout.write() (only error lines)
    grunt.util.hooker.hook(process.stdout, 'write', function(obj) {
        var messages = grunt.log.uncolor((Buffer.isBuffer(obj) ? obj.toString() : (obj.message || obj))).split('\n');
        messages.forEach(function (message) {
            if (message && message.indexOf('error ') > -1) {
                notify(message, 'stdout');
            }
        });
    });

// add a hook to child process stdout/stderr write() (only error lines)
    grunt.util.hooker.hook(grunt.util, 'spawn', {
        post: function(child) {
            child.stderr.on('data', function (data) {
                var messages = grunt.log.uncolor(data.toString()).split('\n');
                messages.forEach(function (message) {
                    notify(message, 'stderr');
                });
            });
            child.stdout.on('data', function (data) {
                var messages = grunt.log.uncolor(data.toString()).split('\n');
                messages.forEach(function (message) {
                    if (message && message.indexOf('error ') > -1) {
                        notify(message, 'stdout');
                    }
                });
            });
        }
    });
}) (module);
