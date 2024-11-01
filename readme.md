# To initialize this project fully, you will have to:

- Go into /generator_tool/backend/index.ts and update the 'root_project_path' to the root path of this entire project (directory where this file is located by default).
- Modify /scripts/project_path.txt to also point to the same root path.

# To run the main project, use the following commands in 3 seperate powershell terminals (update paths to your root path):

cd "E:\Web Dev\2024_Projects\recoil_test\scripts"
.\copy_shared.ps1

cd "E:\Web Dev\2024_Projects\recoil_test\scripts"
.\start_frontend.ps1

cd "E:\Web Dev\2024_Projects\recoil_test\scripts"
.\start_backend.ps1

- NOTE: If you move the project, change the path in ./scripts/project_path.txt to the new location, as well as the above paths.

# To run the code generator project, use the following two commands in 2 seperate powershell terminals:

cd "E:\Web Dev\2024_Projects\recoil_test\generator_tool\backend"
npm run start

cd "E:\Web Dev\2024_Projects\recoil_test\generator_tool\frontend"
npm run dev

- NOTE: I recommend just making your own scripts and process for maximum efficienty. The above is stated to get you started.
