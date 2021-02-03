import TreeModel from '../model/Tree';
export function createTree(tree) {
  TreeModel.create({ tree }).then(doc => {
    console.log(doc);
  });
}