const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer();
const morgan = require("morgan");
const uuid = require("uuid");

app.use(express.static("./views"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(morgan("dev"));

//config
const AWS = require("aws-sdk");
const { response } = require("express");
const config = new AWS.Config({
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  region: "ap-southeast-1",
});

AWS.config = config;
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "DanhSachBaiBao";

app.get("/", (request, response) => {
  const params = {
    TableName: tableName,
  };
  docClient.scan(params, (err, data) => {
    if (err) {
      response.send("Internal Server Error");
    } else {
      return response.render("index", { DanhSachBaiBao: data.Items });
    }
  });
});
app.post("/", upload.fields([]), (request, response) => {
  const {
    ma_baibao,
    ten_baibao,
    ten_nhomtacgia,
    chiso_isbn,
    sotrang,
    namxuatban,
  } = request.body;
  const params = {
    TableName: tableName,
    Item: {
      ma_baibao: Number(ma_baibao),
      ten_baibao: ten_baibao,
      ten_nhomtacgia: ten_nhomtacgia,
      chiso_isbn: chiso_isbn,
      sotrang: Number(sotrang),
      namxuatban: Number(namxuatban),
    },
  };
  console.log(params);
  docClient.put(params, (err, data) => {
    if (err) {
      console.log(err);
      return response.send("Internal Server Error");
    } else {
      return response.redirect("/");
    }
  });
});
app.post("/delete",upload.fields([]), (request, response) => {
  const { ma_baibao } = request.body;
  const params = {
    TableName: tableName,
    Key: {
        ma_baibao: Number(ma_baibao),
      },
  };

  console.log(params);
  docClient.delete(params, (err, data) => {
    if (err) {
      console.log("Error delete");
      console.log(err);
    }
    return response.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
