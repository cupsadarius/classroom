/// <reference path="../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as chaiHttp from 'chai-http';
const server = require('../../bin/server'); //tslint:disable-line
const should = chai.should(); //tslint:disable-line

chai.use(chaiHttp);

describe('Initial endpoint', () => {
  it('should return a json with a message', (done) => {
    chai.request(server).get('/v1').end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.message.should.be.eql('Api entrypoint');

      done();
    });
  });
});
