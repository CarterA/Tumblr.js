prefix = File.dirname( __FILE__ )

source_directory = "Sources"
manifest = [
    "Classes/Base.js",
    "Classes/Utilities.js",
    "Classes/Tumblelog.js",
    "Classes/Post.js",
    "Classes/Post Types/Audio.js",
    "Classes/Post Types/Conversation.js",
    "Classes/Post Types/Link.js",
    "Classes/Post Types/Photo.js",
    "Classes/Post Types/Quote.js",
    "Classes/Post Types/Regular.js",
    "Classes/Post Types/Video.js"
]
products_directory = File.join(prefix, 'Products')

# Tasks
task :default => "all"

desc "Builds Tumblr.js."
task :all => [:tumblrjs] do
  puts "Tumblr.js build complete."
end

desc "Removes Products folder."
task :clean do
  puts "Removing Products directory: #{dist_dir}..." 
  rm_rf products_directory
end

task :tumblrjs do
  puts "Building tumblr.js..."
  if (!File.exists?(products_directory))
      Dir.mkdir(products_directory)
  end
  
  File.open(products_directory + "/tumblr.js", 'w') do |f|
    f.write cat(manifest)
  end
end

def cat( files )
  files.map do |file|
    File.read(File.join("Source", file))
  end.join('')
end