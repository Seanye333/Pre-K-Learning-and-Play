EASIER_MAP: dict[str, str] = {
    "abc": "Practice tracing single letters — tap each letter and listen to its sound",
    "math": "Count objects from 1 to 5 — point at each animal and say the number",
    "memory": "Try a smaller 2x3 card grid — find 3 matching animal pairs",
    "drawing": "Draw with a big brush and bright colors — there's no wrong way to draw!",
    "shapes": "Learn shapes first — tap each shape and hear its name",
    "rhymes": "Try the Find the Rhyme mode — pick from 4 choices",
    "emotions": "Start with Learn Feelings — tap each face to explore emotions",
    "wordbuilder": "Try Easy mode with 3-letter words — cat, dog, sun",
    "colors": "Start with Learn Colors — tap each color and see what objects are that color",
    "animals": "Try Animal Sounds — pick which animal makes each sound",
    "story": "Start with a 3-step story — put the cards in the right order",
    "trace": "Trace simple letters like I, L, and T first — follow the green dot",
    "fruits": "Start with Learn — tap each fruit or veggie to hear its name",
    "opposites": "Browse the Learn tab — see each opposite pair side by side",
    "spotdiff": "Start with the Farm Scene — spot 3 differences to begin",
    "numbertrace": "Trace number 1 first — it's just one straight line down!",
    "sightwords": "Try Flash Cards — flip each card to see the word in a sentence",
    "bodyparts": "Browse the Learn tab — tap each body part to hear a fun fact",
    "daysmonths": "Start with the Days tab — tap each day and learn its emoji",
    "subtraction": "Start with small numbers — tap away 1 or 2 animals first",
    "vehicles": "Start with Learn — tap each vehicle to hear its sound and fun fact",
    "clock": "Start with Learn — see o'clock times with daily activities",
    "shadow": "Look at the overall shape of the shadow before choosing!",
}

SAME_MAP: dict[str, str] = {
    "abc": "Keep exploring letters — try matching uppercase to lowercase",
    "math": "Keep counting animals up to 10 — great work so far!",
    "memory": "Keep playing the 3x4 memory grid — you're getting better each time",
    "drawing": "Keep creating art — try mixing new colors today",
    "shapes": "Keep practicing shape identification — try the Match Outline mode",
    "rhymes": "Keep finding rhymes — try the Rhyme Sort challenge",
    "emotions": "Keep matching emotions — try to explain each feeling out loud",
    "wordbuilder": "Keep building words — aim for a longer streak!",
    "colors": "Keep exploring colors — try the Mix Colors lab and see what new colors you can make",
    "animals": "Keep learning about animals — try Where Do I Live? for a new challenge",
    "story": "Keep sequencing stories — try a new story each round",
    "trace": "Keep tracing — practice makes perfect! Try curved letters next",
    "fruits": "Keep sorting — try the Compare Size tab to guess which is bigger!",
    "opposites": "Keep matching opposites — aim for 10 in a row!",
    "spotdiff": "Keep spotting differences — try to find them all without any wrong taps!",
    "numbertrace": "Keep tracing — try numbers 4, 7, and 8 which have more curves!",
    "sightwords": "Keep reading — try the Find It tab to spot words in sentences",
    "bodyparts": "Keep learning — try the Quiz tab to test what you know!",
    "daysmonths": "Keep practicing — try the Order Game to put days in the right order",
    "subtraction": "Keep going — try bigger numbers like 8 minus 3!",
    "vehicles": "Keep sorting — try to get all 14 vehicles into the right zone!",
    "clock": "Keep reading clocks — try the Quiz tab to test yourself!",
    "shadow": "Keep matching — can you beat your high score?",
}

HARDER_MAP: dict[str, str] = {
    "abc": "Try spelling 4-letter words — you're ready for the next level!",
    "math": "Practice addition up to 15 — count two groups of animals together",
    "memory": "Challenge yourself with the 4x4 grid — 8 pairs to match!",
    "drawing": "Try tracing a shape outline — draw a house or a star",
    "shapes": "Try the Match Outline challenge — match silhouettes to solid shapes",
    "rhymes": "Try Rhyme Sort — separate all the rhyming words from the non-rhymes",
    "emotions": "Play the story-matching game — guess the feeling from the situation",
    "wordbuilder": "Try Hard mode with 5-letter words like 'tiger' and 'cloud'!",
    "colors": "Try Find the Color — identify object colors without any hints",
    "animals": "Try Baby Animals — learn what each baby animal is called",
    "story": "Try putting all 4-step stories in order on the first try without mistakes",
    "trace": "Try the curved and diagonal letters: C, S, A, B, and X — the trickiest ones!",
    "fruits": "Try Sort mode — race to sort all 18 fruits and veggies correctly!",
    "opposites": "Challenge yourself — describe each opposite in your own words!",
    "spotdiff": "Try the Space and Jungle puzzles — they have 3-4 tricky differences!",
    "numbertrace": "Challenge yourself with 6, 8, and 9 — the hardest numbers to trace!",
    "sightwords": "Try the Spell It tab — build sight words from letter tiles!",
    "bodyparts": "Challenge: name every body part and say one thing it helps you do!",
    "daysmonths": "Try the Order Game with months — can you name the season for each one?",
    "subtraction": "Challenge: solve subtraction without tapping the animals — picture it in your head!",
    "vehicles": "Can you name a vehicle for each zone without looking at the cards?",
    "clock": "Try half past times in the Quiz — they are trickier than o'clock!",
    "shadow": "Challenge: guess before the answer reveals — trust your eyes!",
}

WEIGHTS = [0.30, 0.20, 0.15, 0.10, 0.08, 0.06, 0.04, 0.03, 0.02, 0.02]


class TutorEngine:
    def weighted_avg(self, scores: list[float]) -> float:
        if not scores:
            return 0.5
        pairs = list(zip(scores, WEIGHTS[: len(scores)]))
        total_weight = sum(w for _, w in pairs)
        return sum(s * w for s, w in pairs) / total_weight

    def recommend(self, skill: str, scores: list[float]) -> dict:
        avg = self.weighted_avg(scores)
        if avg < 0.60:
            return {
                "action": "easier",
                "next_activity": EASIER_MAP.get(skill, EASIER_MAP["abc"]),
                "current_avg": round(avg, 3),
            }
        elif avg > 0.85:
            return {
                "action": "harder",
                "next_activity": HARDER_MAP.get(skill, HARDER_MAP["abc"]),
                "current_avg": round(avg, 3),
            }
        else:
            return {
                "action": "same",
                "next_activity": SAME_MAP.get(skill, SAME_MAP["abc"]),
                "current_avg": round(avg, 3),
            }
