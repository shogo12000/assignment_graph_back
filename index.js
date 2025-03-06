import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
// import {  cars } from './peopleCarsScheme.js';
import { v4 as uuidv4 } from 'uuid';

let people = [
    {
        id: '1',
        firstName: 'Bill',
        lastName: 'Gates'
    },
    {
        id: '2',
        firstName: 'Steve',
        lastName: 'Jobs'
    },
    {
        id: '3',
        firstName: 'Linuxx',
        lastName: 'Torvalds'
    }
]

export let cars = [
    {
        id: '1',
        year: '2019',
        make: 'Toyota',
        model: 'Corolla',
        price: '40000',
        personId: '1'
    },
    {
        id: '2',
        year: '2018',
        make: 'Lexus',
        model: 'LX 600',
        price: '13000',
        personId: '1'
    },
    {
        id: '3',
        year: '2017',
        make: 'Honda',
        model: 'Civic',
        price: '20000',
        personId: '1'
    },
    {
        id: '4',
        year: '2019',
        make: 'Acura ',
        model: 'MDX',
        price: '60000',
        personId: '2'
    },
    {
        id: '5',
        year: '2018',
        make: 'Ford',
        model: 'Focus',
        price: '35000',
        personId: '2'
    },
    {
        id: '6',
        year: '2017',
        make: 'Honda',
        model: 'Pilot',
        price: '45000',
        personId: '2'
    },
    {
        id: '7',
        year: '2019',
        make: 'Volkswagen',
        model: 'Golf',
        price: '40000',
        personId: '3'
    },
    {
        id: '8',
        year: '2018',
        make: 'Kia',
        model: 'Sorento',
        price: '45000',
        personId: '3'
    },
    {
        id: '9',
        year: '2017',
        make: 'Volvo',
        model: 'XC40',
        price: '55000',
        personId: '3'
    }
]


const app = express();
app.use(cors());

const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: String!
    make: String!
    model: String!
    price: String!
    personId: String!
  }

  type Query {
    people: [Person]
    cars: [Car]
    person(id: ID!): Person
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    addCar(year: String!, make: String!, model: String!, price: String!, personId: ID!): Car
    deleteCar(id: ID!): Car
    deletePerson(id: ID!): Person 
    updatePerson(id: ID!, firstName: String, lastName: String): Person
    updateCar(id: ID!, year: String, make: String, model: String, price: String, personId: ID): Car
  }
`;

const resolvers = {
    Query: {
        people: () => people,
        cars: () => cars,
        person: (_, { id }) => people.find(person => person.id === id)
    },
    Mutation: {
        addPerson: (_, { firstName, lastName }) => {
            const newPerson = { id: uuidv4(), firstName, lastName };
            people.push(newPerson);
            return newPerson;
        },
        addCar: (_, { year, make, model, price, personId }) => {
            const newCar = { id: String(cars.length + 1), year, make, model, price, personId };
            cars.push(newCar);
            return newCar;
        },
        updateCar: (_, { id, year, make, model, price, personId }) => {
            console.log(id)
            const carIndex = cars.findIndex(car => car.id === id);

            if (carIndex === -1) {
                throw new Error("Car not found");
            }
 
            if (year) cars[carIndex].year = year;
            if (make) cars[carIndex].make = make;
            if (model) cars[carIndex].model = model;
            if (price) cars[carIndex].price = price;
            if (personId) cars[carIndex].personId = personId;
    
            return cars[carIndex]; // Retorna o carro atualizado
        },
        deleteCar: (_, { id }) => {
            console.log(id)
            const carIndex = cars.findIndex(car => car.id === id);
            if (carIndex === -1) {
                throw new Error("Car not found");
            }
            // Remover o carro
            console.log(carIndex);
            const [deletedCar] = cars.splice(carIndex, 1);
            console.log(deletedCar);
            return deletedCar;
        },
        deletePerson: (_, { id }) => {
            console.log("Deleting person with ID:", id);

            const personIndex = people.findIndex(person => person.id === id);
            if (personIndex === -1) {
                throw new Error("Person not found");
            }

            // Armazena a pessoa antes de removê-la
            const deletedPerson = people[personIndex];
            console.log("passou2")
            // Remove a pessoa do array
            people.splice(personIndex, 1);
            console.log("passou3")

            // cars = cars.filter(car => car.personId !== id);
            console.log("passou4")
            console.log("Deleted person:", deletedPerson);

            // Retorna a pessoa deletada para o frontend
            return deletedPerson;
        },
        updatePerson: (_, { id, firstName, lastName }) => {
            const personIndex = people.findIndex(person => person.id === id);

            if (personIndex === -1) {
                throw new Error("Person not found");
            }

            // Atualiza apenas os campos fornecidos
            if (firstName) people[personIndex].firstName = firstName;
            if (lastName) people[personIndex].lastName = lastName;

            return people[personIndex]; // Retorna a pessoa atualizada
        },
        updateCar: (_, { id, year, make, model, price, personId }) =>{
            const carIndex = cars.findIndex(person => person.id === id);

            if (carIndex === -1) {
                throw new Error("car not found");
            }

            if (year) cars[carIndex].year = year;
            if (make) cars[carIndex].make = make;
            if (model) cars[carIndex].model = model;
            if (price) cars[carIndex].price = price;
            if (personId) cars[carIndex].personId = personId;

            return cars[carIndex];
        }
    },
    Person: {
        cars: (parent) => cars.filter(car => car.personId === parent.id)
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
server.applyMiddleware({ app });



app.listen(4000, () => {
    console.log('🚀 Server running on http://localhost:4000/graphql');
});
