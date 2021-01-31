  
import asyncio
import logging
import socket
import warnings
import os

import discord
from discord.ext import commands

class Bot(commands.Bot):

  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)

  async def on_connect(self):
    print('[LOGS] Connecting to discord!')

  async def on_disconnect(self):
    print('[LOGS] Bot disconnected.')
    
  async def on_ready(self):
    print('[LOGS] We have logged in as {0.user}'.format(self))

  def add_cogs(self, directory):
    print('[LOGS] Adding cogs from {0} directory'.format(directory))
    for file in os.listdir(directory):
      if file.endswith(".py"):
          name = file[:-3]
          # TODO: MAKE THE LOAD_EXTENSION TO BE MORE ROBUST
          self.load_extension(f"src.cogs.{name}")
    print('[LOGS] Finished loading cogs from directory')
  