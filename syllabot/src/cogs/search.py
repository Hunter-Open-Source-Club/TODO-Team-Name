"""
  Search command category:
    $search {insert query}

  TODO:
  - Make the search process more robust: mispelled words ie
      'hello word' displays similar results to 'hello world'
"""
import json
import discord 

from discord import Embed
from discord.ext import commands

from src import searcher

class Search(commands.Cog):
  def __init__(self, bot):
    self.bot = bot

    self.searcher = searcher.Searcher()

    index = 'CS'
    syllabi_file = 'src/json/processed_index.json'
    self.searcher.add_syllabus(index, syllabi_file)

    course_name_file = 'src/json/course_names.json'
    with open(course_name_file, 'r') as j:
      course_names = json.load(j)

    self.course_names_dict = {}
    for key in course_names.keys():
      self.course_names_dict.update(course_names[key])

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
    embed=discord.Embed(title=title)

    for i, course in enumerate(query_res[:5 if len_query >= 5 else len_query]):
      # Get the directory's keys to match with our directory
      course_num = course['course_id'].replace("_", " ")
      embed.add_field(name='{} {}'.format(str(i + 1) + '.', self.course_names_dict[course_num]), value=course_num, inline=False)

    if len_query == 0:
      embed.add_field(name='None', value='There are no courses containing: \'{}\''.format(query), inline=False)

    await ctx.send(embed=embed)
  


def setup(bot):
  bot.add_cog(Search(bot))