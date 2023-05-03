# cis550-final-project

In a digital world that is dominated by distractedness and emotional unease, we seek to build a platform for mindfulness and internal stability. We are encouraging users to tune into their emotional state and capture the energy imbued within that unprecedented, singular moment. We accomplish this by letting users interface with artistic content (music and quotes) and its creators, based on the user’s mood (and desired mood). Instead of the typically casual, unexamined interaction with media, we provide an engaging, contemplative, and mentally uplifting experience of the current moment.

Preprocessing.py: python file for cleaning Author, Artist, Quote, and Song datasets, as well as normalizing names of authors and artists.
Testing.js: testing processing of user input handled by JavaScript file.


How to run:
- cd into ./final-project/server and run `npm install` then `npm start`
    - Note: might need to run `npm install bootstrap` after `npm install` if hitting an error that mentions not being able to locate bootstrap
- Then, cd into ./final-project/client and run `npm install` then `npm start`
- The application should open in your default browser as localhost:3000