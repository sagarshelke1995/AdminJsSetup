import AdminJS from 'adminjs';

import AllTest from '../models/Alltest.js';
import Category from '../models/Category.js'; // adjust your path

export const getdropDownCategoryOptions = async () => {
  const categories = await Category.find({}, 'title'); // or whatever field you want
  console.log('Categories from DB:', categories);
  
  const availableValues = categories.map(cat => ({
    value: cat.title,
    label: cat.title,
  }));

  return {
    resource: AllTest,
    options: {
      properties: {
        category: {
          availableValues,
          isRequired: true,
        },
      },
    },
  };
};

