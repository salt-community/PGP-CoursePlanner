# Salt Course Planner

## Overview
Salt Course Planner is designed to simplify the planning and execution of recurring courses. By being able to save templates and modules for courses and then applying them directly to the calendar date when it starts.

## Technologies Used
- **frontend**: Vit/React, TypeScript, Tailwind, Daisy UI, MUI
- **backend**: .Net/C#, ASP.NET
- **Containerization**: Docker
- **Cloud Platform**: Google Cloud Platform (GCP)
- **Cloud database**: Supabase

## Prepare to use the project
1. Ask to get access to project in GCP and get the right permissions. 
2. Under API/services click on OAuth consent screen. Add your email to tester if not already there.
3. Under API/services click on Credentials. Add Client ID and Client secret to user secrets using dotnet user-secrets add
4. Get access to Supabase or create a new Supabase db or another alternative. If you change db make sure to update connection string in cloud.
4. Start docker application
5. Compose docker-compose-localDB to create local db for develop.

## Getting Started locally
1. Clone this repository to your local machine.
2. CD in to the backend folder and run dotnet install.
3. Add connectionstring: DevelopmentDb to dotnet user secrets
4. Run dotnet ef database update
5. In backend folder run dotnet run.
6. CD in to the frontend folder and run npm install.
7. Run npm run dev in the frontend folder.
8. Open up the local webpage and start using the web page.

## Understanding the cloud
2. Click hamburger bar in left and select cloud run
3. Find courseplanner-backend
4. Click link and add /swagger to test api
5. Find courseplanner-frontend
6. Click link and enjoy website
7. To change connection string or other secrets click Edit & deploy new revision and variabels and secrets
8. DB is in supabase. Get access to db or create a new one and update connection string.

## Understand pushing to cloud and CI/CD
To deploy a new revision manually first you need to build the frontend or backend docker img.
Then you push the img to artifact registry. 
Then you click Edit & deploy new revision and select the correct new docker img.
The above is done by github actions when you push to main.