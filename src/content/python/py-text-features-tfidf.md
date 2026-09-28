Text has to become numbers before most models can use it. Bag-of-words and TF-IDF are the two simplest, most common ways to do that, both turning a collection of documents into one row per document, one column per word.

You will learn:

- tokenising and stop words
- `CountVectorizer` (bag of words)
- `TfidfVectorizer`
- evaluating a simple text classifier

## Tokenising and stop words

Tokenising splits text into individual words (or sub-word pieces, for more advanced tokenisers); **stop words** are very common words ("the", "is", "and") often removed because they carry little distinguishing information for most tasks.

## CountVectorizer: bag of words

```python
from sklearn.feature_extraction.text import CountVectorizer

docs = ["the cat sat on the mat", "the dog sat on the log"]
vec = CountVectorizer()
matrix = vec.fit_transform(docs)
print(vec.get_feature_names_out())
print(matrix.toarray())
```

Each row counts how many times each vocabulary word appears in that document — "bag of words" because word **order** is completely discarded, only counts survive.

## TfidfVectorizer

```python
from sklearn.feature_extraction.text import TfidfVectorizer

docs = ["the cat sat on the mat", "the dog sat on the log", "cats and dogs"]
vec = TfidfVectorizer()
matrix = vec.fit_transform(docs)
print(vec.get_feature_names_out())
print(matrix.toarray().round(2))
```

TF-IDF weights each word by how often it appears in **this** document (term frequency) divided by how common it is **across all documents** (inverse document frequency) — a word that appears in every document (like "the", if not already removed as a stop word) gets a low weight everywhere, while a word specific to one document gets a high weight there.

## Removing stop words

```python
from sklearn.feature_extraction.text import TfidfVectorizer

docs = ["the cat sat on the mat", "the dog sat on the log"]
vec = TfidfVectorizer(stop_words="english")
matrix = vec.fit_transform(docs)
print(vec.get_feature_names_out())
```

`stop_words="english"` removes a built-in list of common English words before building the vocabulary, shrinking it and often improving results on tasks where those words carry no signal.

## A simple text classifier

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

docs = ["great product love it", "terrible waste of money", "amazing quality highly recommend", "awful do not buy"]
labels = [1, 0, 1, 0]
vec = TfidfVectorizer()
X = vec.fit_transform(docs)
model = LogisticRegression().fit(X, labels)
new_doc = vec.transform(["absolutely great quality"])
print(model.predict(new_doc))
```

The vectoriser is fit **once**, on training text; new text (including anything at prediction time) must go through `.transform` (not `.fit_transform` again) with that same, already-learned vocabulary — fitting a fresh vectoriser on new text would produce a different vocabulary and break the model entirely.

## Watch out: fitting the vectoriser on test text

Exactly the same leakage risk as any other preprocessing step: `fit_transform` on the training documents, then only `.transform` (never re-fitting) on validation or test documents, keeps the vocabulary — and therefore what the model was actually trained on — consistent between the two.

## NLTK, briefly

NLTK is a broader natural-language toolkit (tokenisers, stemmers, part-of-speech taggers, sample corpora) that predates scikit-learn's text tools; some of its resources need a one-time download in a normal Python environment, which is why this playground sticks to scikit-learn's self-contained vectorisers instead.

## Common mistakes

- Calling `.fit_transform` again on new text instead of `.transform`, silently changing the vocabulary the model expects.
- Forgetting that bag-of-words and TF-IDF both discard word order entirely.
- Leaving in stop words for a task where they add pure noise, or removing them for a task (like authorship style) where their frequency is actually meaningful.
- Expecting these simple vectorisers to capture meaning the way modern embedding-based methods can; they only count word occurrences.

## Recap

- `CountVectorizer` counts word occurrences per document; `TfidfVectorizer` weights them by how distinctive each word is.
- `stop_words="english"` removes very common words from the vocabulary.
- Fit the vectoriser once on training text; use `.transform` (not `.fit_transform`) on anything after that.
- Both methods discard word order — they are a simple, strong baseline, not the state of the art.

## Your turn

In the **Practice** tab you write `tfidf_shape(docs)`. Then three challenges use real data.
