package com.sustenage.menta.fontend.exercise.display.blog.data;

import scala.scalajs.js
import scala.scalajs.js.annotation.JSGlobal

val titles = js.Array(
  "media",
  "dinner",
  "person",
  "population",
  "dealer",
  "perception",
  "thought",
  "unit",
  "policy",
  "manager",
  "context",
  "goal",
  "communication",
  "chapter",
  "appointment",
  "investment",
  "player",
  "hat",
  "passion",
  "republic",
  "chimney",
  "predator",
  "vegetation",
  "divorce",
  "behead",
  "royalty",
  "error",
  "emotion",
  "sandwich",
  "bench",
  "reputation",
  "captivate",
  "drown",
  "summary",
  "office",
  "license",
  "grand",
  "wardrobe",
  "delivery",
  "bait"
)

val tags = js.Array(
  "secretary",
  "personality",
  "penalty",
  "vehicle",
  "sir",
  "event",
  "reflection",
  "singer",
  "depression",
  "software"
)

val sentences = js.Array(
  "It caught him off guard that space smelled of seared steak.",
  "If you don't like toenails, you probably shouldn't look at your feet.",
  "Pat ordered a ghost pepper pie.",
  "She thought there'd be sufficient time if she hid her watch.",
  "They finished building the road they knew no one would ever use.",
  "David proudly graduated from high school top of his class at age 97.",
  "The child’s favorite Christmas gift was the large box her father’s lawnmower came in.",
  "The miniature pet elephant became the envy of the neighborhood.",
  "Art doesn't have to be intentional.",
  "The father handed each child a roadmap at the beginning of the 2-day road trip and explained it was so they could find their way home.",
  "Watching the geriatric men’s softball team brought back memories of 3 yr olds playing t-ball.",
  "He ended up burning his fingers poking someone else's fire.",
  "I used to practice weaving with spaghetti three hours a day but stopped because I didn't want to die alone.",
  "He went back to the video to see what had been recorded and was shocked at what he saw.",
  "At that moment she realized she had a sixth sense.",
  "Mom didn’t understand why no one else wanted a hot tub full of jello.",
  "Today I heard something new and unmemorable.",
  "As the asteroid hurtled toward earth, Becky was upset her dentist appointment had been canceled.",
  "Written warnings in instruction manuals are worthless since rabbits can't read.",
  "I'll have you know I've written over fifty novels",
  "The chic gangster liked to start the day with a pink scarf.",
  "Various sea birds are elegant, but nothing is as elegant as a gliding pelican.",
  "It dawned on her that others could make her happier, but only she could make herself happy.",
  "Mary realized if her calculator had a history, it would be more embarrassing than her computer browser history.",
  "The hummingbird's wings blurred while it eagerly sipped the sugar water from the feeder.",
  "My secretary is the only person who truly understands my stamp-collecting obsession.",
  "Be careful with that butter knife.",
  "He embraced his new life as an eggplant.",
  "I currently have 4 windows open up… and I don’t know why.",
  "She had a habit of taking showers in lemonade.",
  "They wandered into a strange Tiki bar on the edge of the small beach town.",
  "Harrold felt confident that nobody would ever suspect his spy pigeon.",
  "I'll have you know I've written over fifty novels",
  "The heat",
  "Improve your goldfish's physical fitness by getting him a bicycle.",
  "The busker hoped that the people passing by would throw money, but they threw tomatoes instead, so he exchanged his hat for a juicer.",
  "After fighting off the alligator, Brian still had to face the anaconda.",
  "He decided to count all the sand on the beach as a hobby.",
  "There's a message for you if you look up.",
  "Poison ivy grew through the fence they said was impenetrable.",
  "The minute she landed she understood the reason this was a fly-over state.",
  "Patricia loves the sound of nails strongly pressed against the chalkboard.",
  "The doll spun around in circles in hopes of coming alive.",
  "Two more days and all his problems would be solved.",
  "Lets all be unique together until we realise we are all the same.",
  "Everyone was busy, so I went to the movie alone.",
  "They called out her name time and again, but were met with nothing but silence.",
  "It's not possible to convince a monkey to give you a banana by promising it infinite bananas when they die.",
  "He kept telling himself that one day it would all somehow make sense.",
  "Never underestimate the willingness of the greedy to throw you under the bus.",
  "I was very proud of my nickname throughout high school but today- I couldn’t be any different to what my nickname was.",
  "The two walked down the slot canyon oblivious to the sound of thunder in the distance.",
  "At that moment I was the most fearsome weasel in the entire swamp.",
  "It caught him off guard that space smelled of seared steak.",
  "I would have gotten the promotion, but my attendance wasn’t good enough.",
  "There's a growing trend among teenagers of using frisbees as go-cart wheels.",
  "It was the scarcity that fueled his creativity.",
  "The Guinea fowl flies through the air with all the grace of a turtle.",
  "I met an interesting turtle while the song on the radio blasted away.",
  "People generally approve of dogs eating cat food but not cats eating dog food.",
  "I’m working on a sweet potato farm.",
  "With the high wind warning",
  "Now I need to ponder my existence and ask myself if I'm truly real",
  "Smoky the Bear secretly started the fires.",
  "Always bring cinnamon buns on a deep-sea diving expedition.",
  "The body piercing didn't go exactly as he expected.",
  "Hang on, my kittens are scratching at the bathtub and they'll upset by the lack of biscuits.",
  "Little Red Riding Hood decided to wear orange today.",
  "He went on a whiskey diet and immediately lost three days.",
  "At that moment she realized she had a sixth sense.",
  "Nobody has encountered an explosive daisy and lived to tell the tale.",
  "He turned in the research paper on Friday; otherwise, he would have not passed the class.",
  "He found his art never progressed when he literally used his sweat and tears.",
  "Seek success, but always be prepared for random cats.",
  "We have a lot of rain in June.",
  "There were three sphered rocks congregating in a cubed room.",
  "There's probably enough glass in my cupboard to build an undersea aquarium.",
  "Wisdom is easily acquired when hiding under the bed with a saucepan on your head.",
  "Going from child, to childish, to childlike is only a matter of time.",
  "He invested some skill points in Charisma and Strength."
)

trait Post extends js.Object:
  val id: Int
  val title: String
  val date: js.Date
  val body: js.Array[String]
  val tags: js.Array[String]

trait PostJson extends js.Object:
  val id: Int
  val title: String
  val date: String
  val body: js.Array[String]
  val tags: js.Array[String]

def genPosts: js.Array[Post] =
  js.WrappedArray.range(0, 100).map(i => randomPost(i)).sortWith { (a, b) =>
    a.date.getTime > b.date.getTime
  }

def randomItem(xs: js.Array[String]): String =
  xs(js.Math.floor(Random.next * (xs.length - 1)).toInt)

def randomPost(id: Int): Post = js.Dynamic
  .literal(
    id = id,
    title = randomItem(titles),
    date = new js.Date(
      2023 + js.Math.floor((Random.next - 0.5) * 5).toInt,
      js.Math.floor(Random.next * 11.99).toInt + 1,
      js.Math.floor(Random.next * 27.99).toInt + 1
    ),
    body = js.WrappedArray
      .range(0, 20)
      .map(_ => randomItem(sentences)),
    tags = js.WrappedArray
      .range(0, js.Math.floor(Random.next * 4).toInt + 1)
      .map(_ => randomItem(tags))
  )
  .asInstanceOf[Post]

@js.native
@JSGlobal
object BlogData extends js.Object {
  val posts: js.Array[PostJson] = js.native
}
