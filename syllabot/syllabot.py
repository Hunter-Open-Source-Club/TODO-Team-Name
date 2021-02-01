'''
  This file creates a bot, specifically 'Syllabot'
'''

# Import Libraries
import os
from dotenv import load_dotenv

# Import 'bot' Class
from src import bot
# Import function that allows third party to keep pinging this webserver to keep it alive
from keep_alive import keep_alive
# Syllabus' bot description
from description import description

# Load and retrieve data from .env
load_dotenv()

# Syllabot 
DISC_TOKEN = os.getenv('DISCORD_TOKEN')
# Athena-bot
# BLAKE_DIS_TOK = os.getenv('BLAKE_DIS_TOK')


# Prefix specification
PREFIX = '$'

COGS_DIR = './src/cogs'

# Create Syllabot
syllabot = bot.Bot(command_prefix=PREFIX, description=description)
# Add different command line operations
syllabot.add_cogs(COGS_DIR)

try:
  keep_alive()
  syllabot.run(DISC_TOKEN)
  # syllabot.run(BLAKE_DIS_TOK)
except Exception as e:
  print(f'Error when logging in: {e}')


