# MovieLens - ETL

ETL is short for extract, transform, load, three database functions that are combined into one tool to pull data out of one database and place it into another database.

* **Extract** is the process of reading data from a database. In this stage, the data is collected, often from multiple and different types of sources.

* **Transform** is the process of converting the extracted data from its previous form into the form it needs to be in so that it can be placed into another database. Transformation occurs by using rules or lookup tables or by combining the data with other data.

* **Load** is the process of writing the data into the target database.

## Descrição: 

Catalog movies based on the rating given by [MovieLens](https://movielens.org/) users. The dataset was collected by GroupLens Research.

**Data Domain**: FILMS CATALOG

**Data source**: https://grouplens.org/datasets/movielens/

**Functional Requirements**:

- List lowest rated movies
- List best rated movies (TOP 100)
- Search by Date
- Search by Title
- Search by Rating
- Search by Gender
- Sort by date
- Sort by relevance
- Sort by Genre

**Non-functional requirements**:

- Usability
- Responsiveness
- Performance

**Data Requirements**:

**1. Movie**: movieId | title | genres

**2. Ratings**: userId | movieId | rating | timestamp

**3. Links**: movieId | imdbId | tmdbId 

**4. Tags**: userId | movieId | tag | timestamp

## Conceptual Model:

![Class Diagram](/src/assets/class-diagram.png)

## Mapping:

| MODELO CONCEITUAL | TIPO NO MC             | MONGODB         | TIPO NO MONGODB         | OBSERVAÇÃO         |
|-------------------|------------------------|-----------------|-------------------------|--------------------|
| Movie             | Classe                 | Movie           | Coleção                 | Principal entidade |
| _id               | Atributo simples       | campo movieId   | campo simples           | obrigatório        |
| title             | Atributo simples       | campo title     | campo simples           | obrigatório        |
| genres            | Atributo multivalorado | campo genres    | campo array             | não obrigatório    |
| Ratings           | Classe                 | Ratings         | Campo array             | não obrigatório    |
| rating            | Atributo simples       | campo rating    | campo simples           | não obrigatório    |
| timestamp         | Atributo simples       | campo timestamp | campo simples           | não obrigatório    |
| userId            | Atributo simples       | campo userId    | campo simples           | não obrigatório    |
| Links             | Classe                 | Links           | objeto embutido         | não obrigatório    |
| imdbId            | Atributo simples       | campo id_imdb   | campo simples           | não obrigatório    |
| tmdbId            | Atributo simples       | campo id_tmdb   | campo simples           | não obrigatório    |
| Tags              | Classe                 | Tags            | Coleção                 | obrigatório        |
| _id               | Atributo simples       | campo tag       | campo simples           | obrigatório        |
| data              | Atributo multivalorado | campo data      | campo array             | obrigatório        |
| timestamp         | Atributo simples       | campo timestamp | objeto embutido em data | obrigatório        |
| userId            | Atributo simples       | campo userId    | objeto embutido em data | obrigatório        |
| movieId           | Atributo simples       | campo movieId   | objeto embutido em data | obrigatório        |

## Prerequisites

- [MongoDB](https://www.mongodb.com/)
- [NodeJS](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

## Get Started

1. Download and unzip [CSV](ml-25m.zip) files or [Permalink](https://grouplens.org/datasets/movielens/25m/)

1. Inside the unzipped folder upload CSV files in MongoDB. In the terminal type
    

    ```
    mongoimport --port=27017 --type csv -d MovieLens -c movies --file movies.csv --headerline

    mongoimport --port=27017 --type csv -d MovieLens -c ratings --file ratings.csv --headerline

    mongoimport --port=27017 --type csv -d MovieLens -c links --file links.csv --headerline

    mongoimport --port=27017 --type csv -d MovieLens -c tags --file tags.csv --headerline
    ```

1.  Install dependencies

    ```
    yarn install
    ```

1. Create the .env: 
    
    Rename _.env.sample_ to _.env_ and set environment variables

1. Run:

    ```
    yarn dev
    ```

## References

[bennadel](https://www.bennadel.com/blog/3232-parsing-and-serializing-large-objects-using-jsonstream-in-node-js.htm)

[freecodecamp](https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/)

[stackabuse](https://stackabuse.com/reading-and-writing-csv-files-with-node-js/)

[dustinpfister](https://dustinpfister.github.io/2018/08/18/nodejs-filesystem-create-read-stream/)
