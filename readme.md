# Project Zero Readme

This is a project designed to create the perfect web architecture that requires writing ZERO boilerplate and writing ZERO duplicated code by hand.

This project consists of two main components:

- Your core web application that you intend to develop and deploy.
- The Code Generation Tool, your all-in-one assistant for generating data types, sharing them throughout your core app, enforcing data naming and normalization rules and so much more.

The power of this architecture lies in how the Code Generation Tool sits on top of your web application to create and manage data. A simple javascript object with only one property entered into the Code Generation Tool's Web UI will produce hundreds of lines of code. And, this code will allow you to immediately access that object and its properties on both the front and back-end of your app using plain javascript objects backed by fully fledged interface, classes, objects, functiuons and more.

# Why Recoil Test?

Because data management in web applications is a pain in the a\*$. There are simply too many pain points when it comes to making web applications.

- Typing restful paths, chatrooms, connection path, and any other string manually leads to the potential for typos that produce errors and waste time.
  - Nobody likes making these connections for every single property in the first place either.
    - It is a very time-con--, no, time-wasting process to have to write effectively the same template over and over again for data that is all basically the same.
- There are no good solutions for sharing interfaces or objects between projects.
  - Interfaces should be auto-generated anyway in the first place.
- Typescript classes generally suck for data management in general and writing and using plain JS objects sucks unless you spend the time to make it not suck (ie. with interfaces).
  - You can just generate the JS objects in a way that doesn't suck and move on with your life, using them with as much efficiency as you would any Typescript class object.

# Ok... what's the catch? Surely somebody else made this magically architecture years ago!

There's no catch and I honestly don't know why this architecture doesn't exist already. Maybe people have a thing against meta-projects? If so, then I can understand. But, the benefits are so tremendous that I think everybody should open their minds to meta-projects.

No seriously - This entire project is open source and you never have to worry about data migration because the Code Generation tool generates ordinary .ts files. There is zero risk in using this architecture as you have full control over it and your data in every capacity from start to finish.

The only reason why you 'might' not use Project Zero is if you aren't a fan of real-time communication via 'ws' and don't want to modify this project to support non-ws logic or there is no way to gradually merge this architecture into an existing codebase. Buit, for new projects, I don't see why you'd ever code any other way again. This deveopment style is as revolutionary as ChatGPT imo.

This architecture works as is and is perfectly capable, sure, but more than that - the idea behind releasing this project is to open the doors to a new era of full-stack development unburdened by the woes of wasteful manual labor. Project Zero completely eliminates several categories oof wasteful data management labor freeing you up to focus on tasks that really matter: creating unique user interfaces, coding unique data interactions and all kinds instead of creating interfaces, spreading them across files, setting up data relationship hierarchy chains, creating methods to change object properties... etc., etc., etc., yuck!

# Really?

Yeah! I mean, I hope! Maybe there is something else like this out there? If so, I didn't find it. Either way, friendly competition is good and this project is the best for my needs regardless.

# To initialize this project fully, you will have to:

- Go into /generator_tool/backend/index.ts and update the 'root_project_path' to the root path of this entire project (directory where this file is located by default).
- Modify /scripts/project_path.txt to also point to the same root path.

- NOTE: Project searching for 'lootquest8' will help you find these references to change them quickly!

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
