require_relative 'spec_helper.rb'

class Hash
	def except(*blacklist)
		reject {|key, value| blacklist.include?(key) }
	end

	def only(*whitelist)
		reject {|key, value| !whitelist.include?(key) }
	end
end

module UserSpecHelper
	def valid_user_attributes
		{ :email => 'Test@localhost',
		:name => 'Mike',
		:password => 'Tes7yasdf' }
	end
end

describe 'A user' do
	include UserSpecHelper

	before do
		@user = User.new
	end

	it 'should be invalid without a name' do
		@user.attributes = valid_user_attributes.except(:name)
		@user.save.should == false
		@user.name = valid_user_attributes[:name]
		@user.save.should == true
	end

	it 'should be invalid without a password' do
		@user.attributes = valid_user_attributes.except(:password)
		@user.save.should == false
		@user.password = valid_user_attributes[:password]
		@user.save.should == true
	end

	it 'should be invalid with a password less than 8 characters long' do
		@user.attributes = valid_user_attributes.except(:password)
		@user.save.should == false
		@user.password = "aaa"
		@user.save.should == false
		@user.password = "asdfghjk4"
		@user.save.should == true
	end

	it 'check_today? should return true only if there are checks today' do
		@user.attributes = valid_user_attributes
		@user.save
		@user.check_today?.should === false
		@task = Task.create(:user => @user, :title => 'Task')
		@check = Check.create(:user => @user, :task => @task, :date => Date.today)
		@user.check_today?.should === true
	end

	it 'remaining_tasks should return an array of remaining checks' do
		@user.attributes = valid_user_attributes
		@user.save
		@task1 = Task.create(:user => @user, :title => 'Task 1')
		@task2 = Task.create(:user => @user, :title => 'Task 2')
		@user.remaining_tasks.should == ['Task 1', 'Task 2']
		@check = Check.create(:user => @user, :task => @task1, :date => Date.today)
		@user.remaining_tasks.should == ['Task 2']
	end

	describe 'when checking to remind' do
		it 'should log "checking"' do
			@user.attributes = valid_user_attributes
			@user.daily_reminder_permission = true
			@user.save
			result = capture_stdout do
				@user.send_reminder_email
			end
	    result.string.should include 'checking'
		end

		it 'should log "sending email" at the right time' do
			@user.attributes = valid_user_attributes
			@user.daily_reminder_permission = true
			@user.daily_reminder_time = Time.now.hour
			@user.save
      Timecop.freeze(Time.new(2012, 1, 2, Time.now.hour))
			result = capture_stdout do
				@user.send_reminder_email
			end
	    result.string.should include 'sending email'
		end
	end
end

describe 'A task' do
	include UserSpecHelper

	before do
		@user = User.new valid_user_attributes
		@task = Task.new
	end

	it 'should be invalid without a user' do
		@task.title = 'Ride a bike'
		@task.save.should == false
		@task.user = @user
		@task.save.should == true
	end

	it 'should be invalid without a title' do
		@task.user = @user
		@task.save.should == false
		@task.title = 'Ride a bike'
		@task.save.should == true
	end
end

describe 'A check' do
	include UserSpecHelper

	before do
		@user = User.new valid_user_attributes
		@task = Task.new :title => 'Ride a bike', :user => @user
	end
end

shared_examples_for "Standards" do
	it 'should have a title' do
		get '/'
		last_response.body.include? "Standards"
	end
end

describe 'When signing up' do
	include UserSpecHelper

	before :each do
		@user = User.create valid_user_attributes
	end

	it 'existing users should be logged in' do
		post "/signup", valid_user_attributes
		last_response.body.include? valid_user_attributes[:name]
		get '/logout'
		post '/login', { :email => valid_user_attributes[:email].upcase, :password => valid_user_attributes[:password] }
		last_response.body.include? valid_user_attributes[:name]
	end

	it 'new users should be created' do
		post "/signup", { :name => 'newtest', :email => 'newtest@gmail.com', :password => 'abcdefghijk' }
		last_response.body.include? 'newtest'
	end
end

describe 'When logging in' do
	include UserSpecHelper

	it 'emails should be case-insensitive' do
		@user = User.create valid_user_attributes
		post '/login', { :email => valid_user_attributes[:email], :password => valid_user_attributes[:password] }
		last_response.body.should_not include "Email and password don't match."
		get '/logout'
		post '/login', { :email => valid_user_attributes[:email].upcase, :password => valid_user_attributes[:password] }
		last_response.body.should_not include "Email and password don't match."
	end
end

describe 'When logged in as a user' do
	it_should_behave_like 'Standards'
	include UserSpecHelper

	before :each do
		@user = User.new valid_user_attributes
		@user.save
		post "/login", valid_user_attributes
	end

	it 'should show welcome message or list tasks' do
		get '/'
		last_response.body.include? "Add a task"
	end

	it 'should allow making a new task' do
		get '/'
		last_response.body.include? "Add it!"
		@task = Task.create :title => 'Ride a bike', :user => @user
		@task.errors.should be_empty
	end

	it 'should allow deleting a task' do
		@task = Task.create :title => 'Ride a bike', :user => @user
		delete '/1/'
		# This is an AJAX request...
		last_response.body.include? 'Task deleted'
	end

	it 'should show user info on the settings page' do
		get '/settings'
		last_response.body.include? 'Mike'
	end
end

describe 'Unauthorized users' do
	it_should_behave_like 'Standards'
	include UserSpecHelper

	before :each do
		@user = User.new valid_user_attributes
		@user.save
		@task = Task.create :title => 'Ride a bike', :user => @user
		get "/logout"
	end

	it 'should not be able to add tasks' do
		get '/new'
		last_response.body.should_not include 'Add it'
	end

	it 'should not be able to view a task' do
		get '/1'
		last_response.body.should_not include 'Ride a bike'
	end

	it 'should not be able to view stats' do
		get '/stats'
		last_response.body.should_not include 'Stats'
	end

	it 'should not be able to view settings' do
		get '/settings'
		last_response.body.should_not include 'Settings'
	end
end

describe 'task pages' do
	it_should_behave_like "Standards"
	include UserSpecHelper

	before :each do
		post "/login", valid_user_attributes
	end

	it 'should throw an error if its not a valid task id' do
		get '/23423423423423'
		last_response.body.include? "That task can't be found."
	end

	it 'should load a task if its a valid task id' do
		test = Task.new :id => 1, :title => "Test task"
		test.save
		get '/1'
		last_response.body.include? "Test task"
	end
end

describe 'not logged in' do
	it_should_behave_like "Standards"

	it 'should flash an error' do
		get '/home'
		last_response.body.include? 'You must be logged in'
	end
end
