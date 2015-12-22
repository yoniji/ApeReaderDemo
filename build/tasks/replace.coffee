module.exports = ->
  @loadNpmTasks "grunt-text-replace"

  # Replace font dir
  @config "replace", 
  	release:
  		src: ["dist/styles.css"]
  		overwrite: true
  		replacements:[
  			from: "/app/fonts/"
  			to: "app/fonts/"
  		]