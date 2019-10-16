console.log(111);

function __generateSequence(num) {
  let index = 1;
  function* gener() {
    for (let t = index; t <= num; t++) {
      yield t;
    }
  }
  return gener();
}

function CustomError(err) {
  return {
    data: null,
    error: err
  };
}

CustomError.prototype = Error.prototype;

let total = 0;

async function __workDone(doSomething) {
  try {
    let resp = await doSomething();
    return {
      data: resp,
      error: null
    };
  } catch (e) {
    throw CustomError(e);
  }
}

export async function retry(doSomething, { retry = 2 }) {
  let seq = __generateSequence(retry);

  /*for (let t = 0; t <= retry; t++) {
    try {
      let r = await __workDone(doSomething);
      console.log(r, 51);
    } catch (e) {
      console.log(41);
    }
  }*/
  return (async function doLoop() {
    let value = seq.next().value;
    try {
      let respo = await __workDone(doSomething);
      return respo;
    } catch (err) {
      if (value <= retry) return doLoop();
      else return err;
    }
  })();
}

const t = () => {
  return new Promise((res, rej) => {
    console.log(total, 70);
    if (total === 5) {
      console.log("HERE");
      res("Hello World");
    } else {
      ++total;
      rej("Why Error.....?");
    }
  });
};

//  Main task goes here.......
(async function() {
  try {
    let y1 = retry(t, {
      retry: 3
    });
    console.log(await y1, 64);
  } catch (e) {
    console.log(65, e);
  }
})();
