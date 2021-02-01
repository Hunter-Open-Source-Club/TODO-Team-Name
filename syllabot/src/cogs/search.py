"""
  Search command category:
    $search {insert query}

  TODO:
  - Make the search process more robust: mispelled words ie
      'hello word' displays similar results to 'hello world'
"""
import json
import pandas as pd
import discord 

from discord import Embed
from discord.ext import commands

from src import searcher
MEILI_INDEX = 'CS'
SYLLABI_FILE = 'src/json/processed_index.json'
COURSE_NAME_FILE = 'src/json/course_names.json'
COURSE_PROF_FILE = 'src/json/professors.json'

with open(COURSE_NAME_FILE, 'r') as j:
  course_names = json.load(j)

with open(COURSE_PROF_FILE, 'r') as j:
  prof_names = json.load(j)

class Search(commands.Cog):
  def __init__(self, bot):
    self.bot = bot

    # TODO: There could be a better way of storing these data
    self.searcher = searcher.Searcher()
    self.searcher.add_syllabus(MEILI_INDEX, SYLLABI_FILE)

    self.course_names_dict = {}
    for key in course_names.keys():
      self.course_names_dict.update(course_names[key])
      
    self.profs_names = prof_names
    
  @commands.command(name='avatar')
  async def ping(self, ctx, *, user: discord.Member = None):
    user = user or ctx.author
    await ctx.send(f"Avatar to **{user.name}**\n{user.avatar_url_as(size=1024)}")
  
  @commands.command(name='search')
  async def search(self, ctx, *args, user: discord.Member = None):
    user = user or ctx.author
    query = " ".join(args)
    # TODO: get meilisearch results and return the top 2
    # FUTURE: Maybe add more function if the return arr is > 2
    index = 'CS'
    query_res = self.searcher.search(index, query)
    len_query = len(query_res)

    # Create Embed
    title = "Courses containing \'{0}\'".format(query)
    embed=discord.Embed(title=title, color=0xd41616)

    for i, course in enumerate(query_res[:5 if len_query >= 5 else len_query]):
      # Get the directory's keys to match with our directory
      course_num = course['course_id'].replace("_", " ")
      course_name = '{} {}'.format(str(i + 1) + '.', self.course_names_dict[course_num])

      # String of professors teaching the class
      prof_teaching = ', '.join(self.profs_names[course_num])
      # Indentation purposes for the display
      course_num_val = course_num + '00' if len(course_num) == 6 else course_num
      course_description = course_num_val + ' | Professor(s): ' + prof_teaching

      embed.add_field(name=course_name, value=course_description, inline=False)

    if len_query == 0:
      embed.add_field(name='None', value='There are no courses containing: \'{}\''.format(query), inline=False)

    await ctx.send(embed=embed)
  


def setup(bot):
  bot.add_cog(Search(bot))