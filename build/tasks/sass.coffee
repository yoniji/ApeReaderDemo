module.exports = ->
  @loadNpmTasks "grunt-contrib-sass"

  # Generate style file
  @config "sass",
    release:
      files:
        "app/styles/styles.css": "app/sass/styles.scss"
      sourcemap: false
