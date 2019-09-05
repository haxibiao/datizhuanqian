import { observable } from 'mobx';

class user {
  constructor(id, name, avatar, token, introducaiton) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.token = token;
    this.introducation = introducation;
    this.gender = gender;
    this.age = age;
    this.profile = {
      introducation: this.introducation
    };
  }
  @observable id = null;
  @observable name = null;
  @observable email = null;
  @observable avatar = null;
  @observable token = null;
  @observable profile = {};
  @observable introducation = null;
  @observable gender = null;
  @observable age = null;
}

export default user;
