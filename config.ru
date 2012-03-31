require './standards'
require 'bowtie'

map "/admin" do
	::BOWTIE_AUTH = {:user => ENV['BOWTIE_USER'], :pass => ENV['BOWTIE_PASSWORD']}
	run Bowtie::Admin
end

map '/' do
	run Sinatra::Application
end