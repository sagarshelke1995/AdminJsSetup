
import Tests from "../models/Alltest.js";


export const getAllTest = async (req, res) => {
  try {
    const test = await Tests.find();
    res.render("index", {
      test,
      check: "test",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const getSingleTest = async (req, res) => {
  try {
    const cat = req.params.cat 
    const slug = req.params.slug 
    const test = await Tests.find({category : cat , slug : slug });
    res.render("_slug_test", {
      test,
      check: "test",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


