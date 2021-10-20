# Master Craft Brewery
--------------

Project developed for educational purposes, by a team of three students. It is a three-layered web application, implemented using ASP.NET Core, ReactJS, Keycloak and MySQL technologies. 
Video demonstrating some of the features is shown below.  
[![MCB](,/video.png)](https://youtu.be/OEtuPdPJEvI).  
## Features
---------------
MasterCraftBrewery is software solution developed to organize work of catering-business object The Master Craft Brewery. Primary goal is to serve marketing and promotion of the object and events in this object via Web presentation. It is divided on public Web presentation and administration part available to registered administartors.
Web presentation has a purpose to show (on attractive way) services that company offers, like food menu, beer map, online ordering, events that company organizes...
Administration part of the system enables registered administrators of the company to change content of Web presentation on simple and intuitive way, to confirm orders and add new administrators.

### Back-end
Business logic and data manipulation is contained in back-end part of the application. 
As database, MySQL is used, combined with Entity Framework Core as Data Access Layer(code first principle). Navigational properties are something new that I use, compared to previous projects, where I haven't used them a lot. If you want to know more about Entity Framework, you can read [my experience](). Automapper is something that I consistently use in my projects (or MapStruct in Java), because the code for mapping classes is easily maintainable. I use it to map entities to DTOs and JSON wrapper classes to DTOs. Rest controllers are lightweight, and most of the logic is contained in classes I named managers in Core project. Using dependency injection, creation of objects is moved to one place and can be easily changed and adapted. Here, I used Microsoft Depdendency Injection, and if you want to see how Autofac is configured, check this project - [Orhedge](https://github.com/chimarry/Orhedge). You can see how some of the new features of C# 8 are used here, like IAsyncEnumerable. One of the favorite things configured in this project is use of .NET authentication and authorization middlewares. Authentication is only done via api key, because the Web presentation is public. Administrators are authorized using JWT token policy and Keycloak. If you want to know more about configuring Keycloak server, contact me on marija.vanja.novakovic@gmail.com. If you want to see more complex authentication flow, check this project - [Chat Application](https://github.com/chimarry/ChatApplication). 

### Front-end
ReactJS is used to build front-end part of the system. Libraries that are worth mentioning are keycloak-js, Bootstrap and Material UI (we used both for educational purposes). 

