import express from "express";
import bodyparser from "body-parser";
import logger from "morgan";
import { port } from "config/keys";
<<<<<<< HEAD
import connectToDatabase from "config/database";
=======
>>>>>>> main
import { syllabi } from "routes";

(async () => {
  try {
    // Initialize express
    const app = express();
    app.set("port", port);

    // Middleware
    app.use(bodyparser.urlencoded({ extended: false }));
    app.use(bodyparser.json());

    if (process.env.NODE_ENV !== "production") {
      app.use(logger("dev"));
      app.use(function (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) {
<<<<<<< HEAD
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
=======
        res.header("Access-Control-Allow-Origin", `http://localhost:3000`);
>>>>>>> main
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
      });
    }

<<<<<<< HEAD
    // Database
    await connectToDatabase();

=======
>>>>>>> main
    // Routes
    app.get("/api", (req: express.Request, res: express.Response) => {
      return res.send("Syllabase server. It's on the syllabus.");
    });

    app.use("/api/syllabi", syllabi);

    // Launch Server
    app.listen(port, () => {
<<<<<<< HEAD
      console.log(`📡 Server up! 📡 Listening on http://localhost:${port}`);
=======
      console.log(`📡 Server up! 📡 Listening on  http://localhost:${port}`);
>>>>>>> main
    });
  } catch (err) {
    console.error(err);
  }
})();
