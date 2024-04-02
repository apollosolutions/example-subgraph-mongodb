import { MongoClient, ServerApiVersion } from "mongodb";

class MongoRepo {
  _client;

  constructor(connectionString) {
    this._client = new MongoClient(connectionString, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  async testConnection() {
    try {
      console.log("MongoRepo: Testing connection...");
      await this._client.connect();
      await this._client.db("admin").command({ ping: 1 });
      console.log("MongoRepo: Test successful.");
    } catch (err) {
      console.log("MongoRepo: Test failed. Reason: " + err);
    } finally {
      // Ensures that the client will close when you finish/error
      await this._client.close();
    }
  }

  async getPatient(filter) {
    try {
      await this._client.connect();

      return await this._client.db("healthcare").collection("patients").findOne(filter);
    } catch (err) {
      console.log("MongoRepo.getPatient: Failed to read data. Reason: " + err);
    } finally {
      // Ensures that the client will close when you finish/error
      await this._client.close();
    }
  }
}

export default MongoRepo;
