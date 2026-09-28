CSV stores data row by row, as plain text. Parquet stores it column by column, in a compact binary form built for exactly the kind of analytical queries this whole tier has been doing. Understanding why unlocks a lot of "just use Parquet" advice.

You will learn:

- row-oriented versus column-oriented storage
- compression and encoding
- predicate pushdown and schemas
- partitioning, and Arrow as a shared in-memory bridge

## Row versus column storage

A CSV file stores an entire row contiguously, then the next row, and so on — natural for "give me this one record", awkward for "give me the average of this one column across every record", which has to skip past every other column on every single row to get there. A columnar format like Parquet stores each column's values contiguously instead, so a query touching only a few columns can skip the rest entirely, never even reading them off disk.

## Compression and encoding

Because a column holds many values of the *same* type, often with real repetition or a narrow range (a status flag, a country code, a small integer), storing them together lets compression exploit that structure far more effectively than compressing mixed, row-by-row text ever could. Parquet also uses per-column **encodings** (like dictionary encoding for repeated categorical values) on top of general compression, often shrinking a file dramatically compared to the equivalent CSV.

## Predicate pushdown

Parquet stores summary statistics (like the min and max value) for chunks of each column. A query with a `WHERE` filter can check that filter against those statistics *before* reading a chunk's actual data, and skip any chunk that could not possibly contain a match — "pushing" the filter down into the read itself, rather than reading everything and filtering afterward.

## Schemas

Unlike CSV (which is just text, with no built-in type information), Parquet stores an explicit schema: every column's name and type, known before reading a single row of data. This is part of why reading a Parquet file never needs the type-guessing (and occasional type-guessing mistakes) that `read_csv` sometimes does.

## Partitioning

A large dataset is often split into multiple Parquet files by a meaningful column — commonly a date, so that `data/year=2024/month=01/` and `data/year=2024/month=02/` sit as separate folders. A query filtering by that column can then skip entire files (or folders) it does not need, without even opening them. Taken too far — thousands of tiny partitions — the per-file overhead (opening, reading metadata) can start to outweigh the benefit; a reasonable partition size balances "skip what you don't need" against "don't create too many small files".

## Arrow as a shared bridge

Apache Arrow defines a columnar **in-memory** format (as opposed to Parquet's on-disk one) that pandas, Polars, DuckDB and other tools can all read and write directly. When two tools both understand Arrow, data can move between them without a slow serialise-to-something-else-and-back-again step — part of why, for example, DuckDB can query a Polars DataFrame (or vice versa) so smoothly.

## Choosing a format

CSV remains genuinely useful for small files, human readability, and universal compatibility with tools that have no Parquet support. Parquet is the better choice once files get large, queries are selective (touching only some columns or rows), or the same data will be read many times by analytical tools that can take advantage of its structure.

## Watch out: many tiny files

Splitting a dataset into more, smaller partitions than actually helps just adds overhead (opening and reading metadata from each file) without a matching benefit — a common mistake when partitioning is applied by habit rather than by checking what the real query patterns actually need to skip.

## Common mistakes

- Defaulting to CSV for large analytical data out of habit, missing the compression and query-skipping benefits Parquet would offer.
- Partitioning by a column with far too many distinct values, producing thousands of tiny files.
- Assuming Parquet is always strictly better; a small file needed by a tool with no Parquet support may still be better off as CSV.
- Forgetting that Parquet's explicit schema means a genuine type mismatch on write will fail loudly, unlike CSV's silent type-guessing.

## Recap

- Column-oriented storage lets a query skip whole columns it does not need; row-oriented storage cannot.
- Compression and per-column encoding shrink Parquet files well beyond an equivalent CSV.
- Predicate pushdown skips whole chunks of data using stored statistics, before reading them.
- Arrow's shared in-memory format lets compatible tools exchange data without a slow conversion step.
