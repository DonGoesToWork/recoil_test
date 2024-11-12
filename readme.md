# Project Zero Readme

This is a project designed to create the perfect web architecture that requires writing ZERO boilerplate and writing ZERO duplicated code by hand.

This project consists of two main components:

- Your core web application that you intend to develop and deploy.
- The Code Generation Tool, your all-in-one assistant for generating data types, sharing them throughout your core app, enforcing data naming and normalization rules and so much more.

The power of this architecture lies in how the Code Generation Tool sits on top of your web application to create and manage data. A simple javascript object with only one property entered into the Code Generation Tool's Web UI will produce thousands of lines of code. And, this code will allow you to immediately access that object and its properties on both the front and back-end of your app using plain javascript objects backed by fully fledged interface, classes, objects, functiuons and more.

# Why Project Zero?

Because data management in web applications is a pain in the a\*$. There are simply too many pain points when it comes to making web applications.

- Typing restful paths, chatrooms, connection path, and any other string manually leads to the potential for typos that produce errors and waste time.
  - Nobody likes making these connections for every single property in the first place either.
    - It is a very time-wasting process to have to write effectively the same template over and over again for data that is all basically the same.
- There are no good solutions for sharing interfaces or objects between a project's frontend and backend.
  - Interfaces should be auto-generated anyway in the first place if you ask me.
- Typescript classes generally suck for data management and writing code with plain JS objects sucks unless you spend the time to make it not suck with tons of interfaces for every object, function, function argument definition.
  - Why not just generate everything? This way you get to use plain JS objects written in a non-sucky way wtih 0 pain points and can move on with your life to actually write useful code.

# Ok... what's the catch? Surely somebody else made this magically architecture years ago!

There's no catch and honestly there are some architectures that do behave 'similarly' to Project Zero. However, in general, they have a few limitations:

- Are an npm package dependency that you need to add to your project.
  - More depedency set, configuration, compatibility, h@$$ (or bloat) to deal with.
  - Can't modify/maintain npm packages easily (if you want to do that)
  - Low transparency into how project works beyond without substantial research of help docs + source.
- Will usually only solve one or a few pieces to the puzzle of the full problem: creating an easy, seamless full-stack web development experience.
- Hard 'lock-in' to whatever 'magic' design the package chooses.

In contrast, Project Zero is a web application that has none of these issues.

- Is a web application that accesses your core application from the outside, meaning no added dependency to core project.
  - You can delete Project Zero at any time and your application will still work.
- Generates ordinary code straight into your main project, allowing you to inspect every resource that it creates at a glance.
- Automatically addresses all of the issues of sharing resources between your front and back-end (a true 'full-stack solution').
  - Additionally creates and puts resources where they are needed automatically.

I know. It sounds too good to be true. But, it's really not. But, if you want real reasons for why you might not use Project Zero, then these might be some:

- The idea of running a second web application while coding disgusts you.
- Flat state maps equally disgust you.
- You don't like real-time communication with 'ws'.
- You don't want to modify this application to support some non-ws communication protocol.
- Your project is already too big to merge this architecture into.

But, if none of these issues are a problem for you, then I really don't see why you'd code any other way again. This deveopment style is as revolutionary as ChatGPT imo. Stop writing boilerplate!

# Ok! I'm Sold!

Great! My last comment is to remind you that this is a project written by one random dude on the web specifically for his goal of creating a real-time multiplayer game. As such, while everything I said above is true, I make no promises beyond what I've said - like - for instance - I have done no investigation into how secure Project Zero is and I honestly doubt that it is by default. And, it could be flawed in other ways that are meaningful to you that I don't know. You've been warned. 🤷🏼

This architecture works as is and is perfectly capable, sure, but more than that the idea behind releasing Project Zero is to open the doors to a new era of full-stack development unburdened by the woes of wasteful manual labor. Project Zero completely eliminates several categories oof wasteful data management labor freeing you up to focus on tasks that really matter: creating unique user interfaces, coding unique data interactions and all kinds of other valuable work instead of wasting time creating interfaces, spreading them across files, setting up data relationship hierarchy chains, creating methods to change object properties... etc., etc., etc., yuck!

# To initialize this project fully, you will have to:

- Go into /generator_tool/backend/index.ts and update the 'root_project_path' to the root path of this entire project (directory where this file is located by default).
- Modify /scripts/project_path.txt to also point to the same root path.

NOTE: Project searching for 'lootquest8' will help you find these references to change them quickly!

- Run npm install in four locations: Project Zero's front-end and back-end and the Main Project's front-end and back-end.

# To run this project, you'll want to set up 5 Powershell Termainals (Hope you have Windows Explorer!). First, Git:

cd "E:\Web Dev\2024_Projects\lootquest8"

# Next, Main Project (update paths to your root path):

cd "E:\Web Dev\2024_Projects\lootquest8\scripts"
.\start_main_frontend.ps1

cd "E:\Web Dev\2024_Projects\lootquest8\scripts"
.\start_main_backend.ps1

- NOTE: If you move the project, change the path in ./scripts/project_path.txt to the new location, as well as the above paths.

# Project Zero:

cd "E:\Web Dev\2024_Projects\lootquest8\scripts"
.\start_generator_backend.ps1

cd "E:\Web Dev\2024_Projects\lootquest8\scripts"
.\start_generator_frontend.ps1

- NOTE: I recommend just making your own scripts and process for maximum efficienty. The above is stated to get you started.
