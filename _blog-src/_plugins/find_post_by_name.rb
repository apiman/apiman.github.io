require 'uri'

module Jekyll
  module FindPostByNameFilter
    def find_post_by_name( input )
      url = URI(input)
      extname = File.extname(url.path) || ""
      url.path.split("/").last.chomp(extname)
    end
  end
end

Liquid::Template.register_filter(Jekyll::FindPostByNameFilter)
