module.exports = ->
  @loadNpmTasks "grunt-contrib-watch"

  # Generate style
  @config "watch",
    sass:
        files: "app/sass/**/*.scss"
        tasks: ["sass"]
