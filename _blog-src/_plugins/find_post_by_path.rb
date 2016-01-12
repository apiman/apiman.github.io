require 'uri'

module Jekyll
  module FindPostByPathFilter
    def find_post_by_path( input )
      url = URI(input)
      extname = File.extname(url.path) || ""
      url.path.split("/").last.chomp(extname)
    end
  end
end

Liquid::Template.register_filter(Jekyll::FindPostByPathFilter)
