# scripts/

Automation that turns an app definition in `apps/<app>/` into a built app: validate the definition, apply it to the native projects, generate assets, build, deploy.

Guidelines for what goes here:
- One script per job, runnable on its own from the command line.
- A script takes the app as an argument and never hard-codes one.
- Running a script twice gives the same result as running it once.
- No secrets in the repo; scripts read them from the environment.

Empty for now. The first script arrives in roadmap step 3.
