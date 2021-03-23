# Display

CLI input options:

- Do you want to check a single Azure App secret or multiple?
  - Single
    - Input tenant ID
    - Input client ID
    - Input client secret
  - Multiple
    - How would you like to input the required information (tenant ID, client ID and client secrets)
      - Select a local file
      - Direct input as an array
      - FTP (?)

- How would you like to export the results?
  - To local file
    - IF DIR NOT EXIST - Would you like to create the directory?
    - IF FILE EXISTS - Would you like to overwrite the file?
      - Yes
      - No
  - Email
    - SMTP built into project
    - Sendgrid (?)
    - Mailchimp (?)
  - FTP (?)
