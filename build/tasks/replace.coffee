module.exports = ->
  @loadNpmTasks "grunt-text-replace"

  # Replace font dir
  @config "replace", 
  	release:
  		src: ["dist/styles.css"]
  		overwrite: true
  		replacements:[
  			{from: "/app/fonts/", to: "app/fonts/"}
  			{from: "display: flex;",to:"display:-webkit-box;display: -moz-box;display: box;display: -webkit-flex;display: -moz-flex;display: -ms-flexbox;display: flex;"}
  		]