Group Members: Dan Beauchaine, Gavin Stankovsky, Jackie Sobolewski  
Meeting Date: 9/15/2025  
Meeting Time: 7pm  
Members Present:  
Upcoming Deliverables: [Functional Requirements/Use Case Models/User Stories](https://docs.google.com/document/d/15YNmKwkxfkvX6OTlKG83YQ5qtGbaL_ctJ_EB14hhv-4/edit?usp=sharing) Due Sept 25  
Next Meeting:  

### Standard Agenda
| Time | What | 
|---|---|
| 5 min | Quick Check Ins, Status Updates, Upcoming Deliverables |
| 45 min | Review Agenda Items and To Dos (from meeting minutes or Jira) |
| 5 min | Issues discussion, make plan for resolving (add more time to meeting? schedule separate meeting?) |
| 5 min | Review takeaways, new action items, and decisions made from this meeting | 

### Meeting Agenda Items
| Topic | Who | Expected Time | Notes | 
|---|---|---|---|
| Functional Requirements, Use Case Model Overview and Questions | Jackie | 40min | Review UI design, discuss and answer questions (see below)|
| Jira Review | All | 5 min | | 

#### Questions 
* General question about barebones fulfillment of requirements vs ensuring we have conventional website design and elements (without over doing it)
* Alerts for upcoming appointments - what should this look like? list upcoming appointments prominantly on the dashboard ok? Or a pop up alert? 
What does upcoming mean? A timeframe that we determine? Or is there a setting that the user selects?
* Searching/Booking Appointments by Service Provider - this is not mentioned anywhere in the project requirments, but seems like it would be pretty standard. Should we include this functionality or is it overkill since not explicitly required?
* Similarly, nothing mentioned about specific services offered by service provider, only the category. Again, seems weird to not include. Do we want to include? And if so, can a service provider offer more than one service? And if so, when they set their availability, do they set by which service?
* Requirement states that a user can make/search/modify their appointment. What should the functionality be for modify? Just cancel? 
* Forgot password on login page - is pretty standard. Do we want this, if so, how to implement?
* User Appointment view - ok as just a list? Or should there be a calendar view?
* Service Provider appointment availability - how should this work? Couple of options that I can think of:  
    Specific Time Slots for specific appointment types Ex: Monday 9-10am Haircut, 10-11:00am Haircut, 11-11:30 Nails  
    Specific Time Slots, whatever fits: Monday 9-9:45am, 10-10:45 am, etc and then appointment types have durations, so when user selects appointment
    type, only the timeslots that are the right lenght will be available  
    Availability Time Blocks: Monday 8am - 5pm, and then appointment types have durations, so a user selects appointment type and then selects a time     within the available time block  

    For any of these, need to think through the UI and how we can implement...

#### UI Design Drafts

##### Login Page and Registration Page for all user types
<img src="https://github.com/beauchdj/Project/blob/397269d0d7e7eee3903b55547db007e4f3327c81/MeetingMinutes/Images/1_Login_Register.jpg" alt="login and registration page sketch" width="400" height="600">
##### User: Dashboard and Appointment Booking Pages
<img src="https://github.com/beauchdj/Project/blob/b47bc7a651a49577f6dfe2920a5665297b2868f1/MeetingMinutes/Images/2_User_Dash_BookAppt.jpg" alt="User dashboard and book appointment page sketch" width="400" height="600">
##### User: View Appointments Page and Account Settings Page
<img src="https://github.com/beauchdj/Project/blob/d05ba3f04f8cbdb5fee7b67b5b7926a0f5d83954/MeetingMinutes/Images/3_User_ViewAppts_Settings.jpg" alt="User view all appointments page and settings page sketch" width="400" height="600">
##### Service Provider: Dashboard and Appointment Availability Pages
<img src="" alt="Service Provider dashboard and appointment availability pages" width="400" height="600">
##### Service Provider: View Appointments page and Account Settings Page
<img src="" alt="Service Provider view appointments and account settings pages" width="400" height="600">
### Service 
