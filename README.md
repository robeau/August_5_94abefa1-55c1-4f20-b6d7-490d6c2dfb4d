
Gmail parser using Expressjs and node IMAP.

# To run the application:
IMPORTANT: The email inbox you want to access MUST have the setting set to allow less secure apps. To apply these settings, so the following:
- From your gmail account, click on the icon in the upper right corner, then click 'my account'.
- Click 'connected apps and sites
- Under 'Allow less secure apps'  make sure the switch is set to 'on'.

Once you have your gmail settings ready:
- Download the repository.
- Open routes/index.js and change the user and password (on lines 11 and 12).
- Run 'bin/www'.
- Open an internet browser and navigate to http://localhost:3000/

NOTE: Current settings only shows stats for emails received after July 20th, 2015. You can change the range by altering BACKDATE on line 20.
