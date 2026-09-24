export const sqlExercises = [
  {
    id: 'sql-top-ten',
    subject: 'sql',
    title: 'The Spotify top ten',
    difficulty: 'easy',
    tags: ['ORDER BY', 'LIMIT'],
    dataset: 'spotify-2024',
    orderMatters: true,
    brief: `The editorial team is building a **"Top 10 on Spotify"** banner for the homepage and needs the data behind it.

Pull the ten most streamed songs.

**Return:** \`track\`, \`artist\`, \`spotify_streams\`, most streamed first.`,
    referenceQuery: `SELECT track, artist, spotify_streams
FROM songs
ORDER BY spotify_streams DESC
LIMIT 10;`,
    walkthrough: `Sort everything by \`spotify_streams\` from biggest to smallest, then keep the first ten rows.

\`ORDER BY ... DESC\` does the sorting and \`LIMIT 10\` does the cutting. Without the \`ORDER BY\`, \`LIMIT\` would return ten arbitrary rows.

Look closely at the result and you'll see some songs twice, under different artists. Real data is messy: the same track can be uploaded by several accounts, and the dataset treats each upload as its own row. Noticing that before you ship a banner is part of the job.`,
  },

  {
    id: 'sql-shazam-gaps',
    subject: 'sql',
    title: 'How complete is the Shazam data?',
    difficulty: 'easy',
    tags: ['COUNT', 'NULL'],
    dataset: 'spotify-2024',
    orderMatters: false,
    brief: `Before the data team builds a Shazam chart, they want to know how much Shazam data is actually there. Missing values are stored as \`NULL\`.

**Return one row** with:

1. \`total_songs\`: how many songs there are
2. \`missing_shazam\`: how many have no \`shazam_counts\`
3. \`pct_missing\`: the share of songs missing it, as a percentage rounded to **1 decimal place**`,
    referenceQuery: `SELECT COUNT(*) AS total_songs,
       COUNT(*) - COUNT(shazam_counts) AS missing_shazam,
       ROUND(100.0 * (COUNT(*) - COUNT(shazam_counts)) / COUNT(*), 1) AS pct_missing
FROM songs;`,
    walkthrough: `\`COUNT(*)\` counts every row. \`COUNT(column)\` counts only the rows where that column is **not** \`NULL\`. The difference between the two is the number of missing values.

Two details are easy to get wrong:

- **Integer division.** \`577 / 4598\` in SQLite is \`0\`, because both sides are integers. Multiplying by \`100.0\` first turns the whole expression into decimal arithmetic.
- **Rounding.** \`ROUND(x, 1)\` keeps one decimal place.

You could also write the missing count as \`SUM(shazam_counts IS NULL)\`. It gives the same answer.`,
  },

  {
    id: 'sql-clean-radio',
    subject: 'sql',
    title: 'The clean radio shortlist',
    difficulty: 'easy',
    tags: ['WHERE', 'ORDER BY'],
    dataset: 'spotify-2024',
    orderMatters: true,
    brief: `A radio station is putting together a family-friendly playlist of current hits.

Find songs that are **not explicit**, were released **in 2024** (on or after 2024-01-01), and have a \`spotify_popularity\` of **85 or higher**.

**Return:** \`track\`, \`artist\`, \`spotify_popularity\`. Most popular first, and alphabetical by \`track\` when the popularity is the same.`,
    referenceQuery: `SELECT track, artist, spotify_popularity
FROM songs
WHERE explicit_track = 0
  AND release_date >= '2024-01-01'
  AND spotify_popularity >= 85
ORDER BY spotify_popularity DESC, track ASC;`,
    walkthrough: `Three conditions joined with \`AND\`, then a two-level sort.

- \`explicit_track = 0\` keeps the clean songs.
- \`release_date\` is stored as text in \`YYYY-MM-DD\` form, and text in that shape sorts the same way dates do, so \`release_date >= '2024-01-01'\` works.
- \`ORDER BY spotify_popularity DESC, track ASC\` sorts by popularity first. The second column only matters when the first one ties.`,
  },

  {
    id: 'sql-explicit-effect',
    subject: 'sql',
    title: 'Do explicit songs stream more?',
    difficulty: 'medium',
    tags: ['GROUP BY', 'CASE', 'AVG'],
    dataset: 'spotify-2024',
    orderMatters: true,
    brief: `An artist manager asks whether adding explicit lyrics actually helps a song on Spotify. Compare the two groups.

In \`explicit_track\`, \`1\` means explicit and \`0\` means clean.

**Return** one row per group:

1. \`label\`: the text \`Explicit\` or \`Clean\`
2. \`songs\`: how many songs are in the group
3. \`avg_streams\`: the average \`spotify_streams\`, rounded to a **whole number**

Sort by \`label\` alphabetically.`,
    referenceQuery: `SELECT CASE explicit_track WHEN 1 THEN 'Explicit' ELSE 'Clean' END AS label,
       COUNT(*) AS songs,
       ROUND(AVG(spotify_streams)) AS avg_streams
FROM songs
GROUP BY explicit_track
ORDER BY label;`,
    walkthrough: `\`GROUP BY explicit_track\` makes one bucket per value, and the aggregates (\`COUNT\`, \`AVG\`) are computed inside each bucket.

\`CASE\` turns the raw \`0\`/\`1\` flag into a readable label. You can group by the flag and label it in \`SELECT\`, as here, or group by the \`CASE\` expression itself.

\`AVG\` ignores \`NULL\`s, so songs with no stream count don't drag the average down.

The answer to the manager's question: the averages are within about 1% of each other, so the data doesn't show that explicit lyrics help.`,
  },

  {
    id: 'sql-release-calendar',
    subject: 'sql',
    title: 'The 2024 release calendar',
    difficulty: 'medium',
    tags: ['GROUP BY', 'strftime'],
    dataset: 'spotify-2024',
    orderMatters: true,
    brief: `A marketing team is planning campaigns and wants to see how many charting songs were released in each month of 2024.

Only include songs released **on or after 2024-01-01**.

**Return:**

1. \`month\`: the month as **two-character text**, like \`03\`
2. \`songs\`: how many songs were released that month

Sort by \`month\`, earliest first.`,
    referenceQuery: `SELECT strftime('%m', release_date) AS month,
       COUNT(*) AS songs
FROM songs
WHERE release_date >= '2024-01-01'
GROUP BY month
ORDER BY month;`,
    walkthrough: `SQLite has no dedicated date type. Dates live in text columns, and \`strftime\` pulls parts out of them. \`strftime('%m', release_date)\` returns the month as text, \`'01'\` to \`'12'\`, which is exactly the two-character format the brief asks for.

You can group by the alias (\`GROUP BY month\`). SQLite allows it.

The dataset ends in June 2024, so only six months appear. A month with no songs wouldn't appear at all, because \`GROUP BY\` only makes buckets for values that exist.`,
  },

  {
    id: 'sql-hit-factories',
    subject: 'sql',
    title: 'Hit factories',
    difficulty: 'medium',
    tags: ['GROUP BY', 'HAVING'],
    dataset: 'spotify-2024',
    orderMatters: true,
    brief: `A record label is scouting for artists who land hit after hit rather than a single viral song.

Find artists with **at least 30 songs** in the dataset.

**Return:**

1. \`artist\`
2. \`songs\`: how many songs they have
3. \`total_streams\`: the sum of their \`spotify_streams\`

Sort by \`songs\`, highest first, and by \`total_streams\`, highest first, when the counts are equal.`,
    referenceQuery: `SELECT artist,
       COUNT(*) AS songs,
       SUM(spotify_streams) AS total_streams
FROM songs
GROUP BY artist
HAVING COUNT(*) >= 30
ORDER BY songs DESC, total_streams DESC;`,
    walkthrough: `You can't put an aggregate in \`WHERE\`, because \`WHERE\` runs **before** the groups exist. Filtering on a group's size needs \`HAVING\`, which runs **after** grouping:

\`\`\`
FROM  ->  WHERE  ->  GROUP BY  ->  HAVING  ->  SELECT  ->  ORDER BY
\`\`\`

\`HAVING COUNT(*) >= 30\` throws away every artist with fewer than 30 songs. The two-level \`ORDER BY\` breaks the tie between Drake and Taylor Swift, who have the same number of songs.`,
  },

  {
    id: 'sql-viral-audio',
    subject: 'sql',
    title: 'The viral audio detector',
    difficulty: 'medium',
    tags: ['NULL', 'arithmetic', 'ORDER BY'],
    dataset: 'spotify-2024',
    orderMatters: true,
    brief: `Some sounds explode on TikTok long before they get real streaming numbers. A trends analyst wants to find them.

For each song, compute the **TikTok-to-Spotify ratio**: \`tiktok_views\` divided by \`spotify_streams\`.

- Ignore songs with no TikTok data (\`tiktok_views\` is \`NULL\`).
- Ignore songs with no Spotify streams (\`spotify_streams\` is \`NULL\` or zero).

**Return the 10 songs with the highest ratio:**

1. \`track\`
2. \`artist\`
3. \`tiktok_views\`
4. \`spotify_streams\`
5. \`ratio\`: rounded to **2 decimal places**

Highest ratio first.`,
    referenceQuery: `SELECT track, artist, tiktok_views, spotify_streams,
       ROUND(1.0 * tiktok_views / spotify_streams, 2) AS ratio
FROM songs
WHERE tiktok_views IS NOT NULL
  AND spotify_streams > 0
ORDER BY ratio DESC
LIMIT 10;`,
    walkthrough: `Two traps here.

**Integer division.** \`tiktok_views / spotify_streams\` divides two integers, and SQLite throws away the remainder. A ratio of 3.7 would silently become 3. Multiplying by \`1.0\` first forces decimal arithmetic.

**Missing data.** \`spotify_streams > 0\` filters out both zeros and \`NULL\`s (comparing \`NULL\` to anything is never true), so it guards the division. The explicit \`tiktok_views IS NOT NULL\` says what you mean.

Look at the winners: tiny sound-effect uploads with billions of TikTok views and a few thousand streams. The ratio finds them, but a real analyst would ask whether they count as "songs" at all.`,
  },

  {
    id: 'sql-decade-report',
    subject: 'sql',
    title: 'Popularity by decade',
    difficulty: 'medium',
    tags: ['GROUP BY', 'HAVING', 'expressions'],
    dataset: 'spotify-2024',
    orderMatters: true,
    brief: `A documentary team is asking whether older songs still hold their own on Spotify. Group the songs by the **decade** they were released in.

**Return:**

1. \`decade\`: the first year of the decade as a number (\`2010\`, \`2020\`, and so on)
2. \`songs\`: how many songs came from that decade
3. \`avg_popularity\`: the average \`spotify_popularity\`, rounded to **1 decimal place**

Skip decades with **fewer than 30 songs**, since a small sample tells you nothing. Sort by \`decade\`, oldest first.`,
    referenceQuery: `SELECT (CAST(substr(release_date, 1, 4) AS INTEGER) / 10) * 10 AS decade,
       COUNT(*) AS songs,
       ROUND(AVG(spotify_popularity), 1) AS avg_popularity
FROM songs
GROUP BY decade
HAVING COUNT(*) >= 30
ORDER BY decade;`,
    walkthrough: `There's no "decade" column, so you build one. Take the year (\`substr(release_date, 1, 4)\`, or \`strftime('%Y', ...)\`), turn it into a number, divide by 10 and multiply by 10. Integer division throws away the remainder, which here is exactly what you want: 2017 becomes 2010.

Once the expression has an alias you can \`GROUP BY\` it. \`HAVING\` then drops the thin decades.

The takeaway: older songs that still chart score higher on average. They only appear because they are big enough to stay in the data, which is called survivorship bias.`,
  },

  {
    id: 'sql-flagship-songs',
    subject: 'sql',
    title: 'Every artist’s flagship song',
    difficulty: 'hard',
    tags: ['window functions', 'subqueries'],
    dataset: 'spotify-2024',
    orderMatters: true,
    brief: `A playlist curator wants one song to represent each major artist: their single most streamed track.

Consider only artists with **at least 20 songs** in the dataset.

**Return** one row per artist:

1. \`artist\`
2. \`track\`: their most streamed song
3. \`spotify_streams\`: that song's streams

Sort by \`spotify_streams\`, highest first.`,
    referenceQuery: `SELECT artist, track, spotify_streams
FROM (
  SELECT artist, track, spotify_streams,
         ROW_NUMBER() OVER (PARTITION BY artist ORDER BY spotify_streams DESC) AS rn,
         COUNT(*) OVER (PARTITION BY artist) AS artist_songs
  FROM songs
)
WHERE rn = 1
  AND artist_songs >= 20
ORDER BY spotify_streams DESC;`,
    walkthrough: `"The top row per group" is the classic case for a window function. \`ROW_NUMBER() OVER (PARTITION BY artist ORDER BY spotify_streams DESC)\` numbers each artist's songs from most to least streamed, so the flagship song is the one numbered 1.

A second window, \`COUNT(*) OVER (PARTITION BY artist)\`, puts each artist's song count on every row, so you can filter on it. Neither can be used in \`WHERE\` in the same query. They are computed after it. That's why the window functions live in a subquery, and the filtering happens outside.

There is a plain-\`GROUP BY\` route too: take \`MAX(spotify_streams)\` per artist, then join back to find the track. It looks right, but this data breaks it. Olivia Rodrigo's "drivers license" and Morgan Wallen's "Last Night" are each listed twice, with different ISRC codes but identical stream counts. The join matches both copies and returns two rows for those artists. \`ROW_NUMBER()\` hands out exactly one 1 per artist, so it never has that problem.`,
  },

  {
    id: 'sql-cross-platform',
    subject: 'sql',
    title: 'Cross-platform champions',
    difficulty: 'hard',
    tags: ['CTE', 'RANK', 'JOIN'],
    dataset: 'spotify-2024',
    orderMatters: true,
    brief: `A brand wants a song that wins on **both** Spotify and YouTube for a big sponsorship. Find the songs that rank in the **top 100 on both platforms**.

Rank songs separately on each platform, highest first: by \`spotify_streams\` on Spotify and by \`youtube_views\` on YouTube. Ignore songs with no value on that platform. Use \`RANK()\` so ties share a rank.

Match a song's two ranks by \`track\` **and** \`artist\`.

**Return:**

1. \`track\`
2. \`artist\`
3. \`spotify_rank\`
4. \`youtube_rank\`

Sort by \`spotify_rank\`, best first.`,
    referenceQuery: `WITH spotify AS (
  SELECT track, artist,
         RANK() OVER (ORDER BY spotify_streams DESC) AS spotify_rank
  FROM songs
  WHERE spotify_streams IS NOT NULL
),
youtube AS (
  SELECT track, artist,
         RANK() OVER (ORDER BY youtube_views DESC) AS youtube_rank
  FROM songs
  WHERE youtube_views IS NOT NULL
)
SELECT spotify.track, spotify.artist, spotify_rank, youtube_rank
FROM spotify
JOIN youtube
  ON youtube.track = spotify.track
 AND youtube.artist = spotify.artist
WHERE spotify_rank <= 100
  AND youtube_rank <= 100
ORDER BY spotify_rank;`,
    walkthrough: `Break it into three steps, each easy to check on its own:

1. **A ranking per platform.** Two CTEs (\`WITH ... AS\`) each produce a rank using \`RANK() OVER (ORDER BY ...)\`. Filtering out \`NULL\`s first matters: otherwise missing values would be ranked too.
2. **A join.** Match the two lists on \`track\` **and** \`artist\`. Matching on the name alone would pair up different artists' songs with the same title.
3. **A filter and a sort.** Keep rows where both ranks are 100 or better.

The order of operations matters: each rank is computed across the *whole* dataset, and only then filtered. If you filtered to the top 100 first and ranked afterward, every rank would start at 1 again.`,
  },
]
