const { Secure } = require("../../utils");
const TABLE = "enterprise";
const Base = new (require("../../database/base"))(TABLE);
const TABLE_images = "images";
const Base_images = new (require("../../database/base"))(TABLE_images);

const addEnterprise = async (data) => {
  return Base.add(data);
};

const updateEnterprise = async (req, res) => {
  return Base.update({ id: req.params.id, ...req.body });
};

const deleteEnterprise = async (id) => {
  return Base.remove(id);
};

const getEnterprise = async function () {
  const enterprise = await Base.getAll();
  let result = [];
  await Promise.all(
    enterprise.map(async (x) => {
      console.log("Result1", x.id);

      const enterpriseById = await Base.getById(x.id);
      const image = await Base_images.getByEnterpriseId(x.id);

      const data = {
        enterprise: enterpriseById,
        images: image,
      };

      result.push(data);
    })
  );
  console.log("Result3", result);
  return result;
};

const getEnterpriseById = async function (id) {
  const enterprise = await Base.getById(id);
  const images = await Base_images.getByEnterpriseId(id);

  const data = {
    enterprise: enterprise[0],
    images,
  };
  return data;
};

exports.addEnterprise = addEnterprise;
exports.getEnterprise = getEnterprise;
exports.updateEnterprise = updateEnterprise;
exports.deleteEnterprise = deleteEnterprise;
exports.getEnterpriseById = getEnterpriseById;
