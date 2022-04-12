export function statement(invoice, plays) {
  let total_amount = 0;
  let volume_credits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    // const play = play_for(perf); //우변을 함수로 추출 -> 인라인 변수 제거
    // let this_amount = 0; 지역변수 제거

    // this_amount = amount_for(perf); // 불필요 변수 제거

    // 포인트를 적립한다.
    volume_credits += Math.max(perf.audience - 30, 0);

    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play_for(perf).type)
      volume_credits += Math.floor(perf.audience / 5);

    //청구 내역을 출력한다.
    result += ` ${play_for(perf).name}: ${format(amount_for(perf) / 100)} (${
      perf.audience
    }석)\n`;
    total_amount += amount_for(perf); // this_amount 변수를 인라인으로
  }
  result += `총액: ${format(total_amount / 100)}\n`;
  result += `적립 포인트 : ${volume_credits}점\n`;
  return result;
}

function amount_for(a_performance) {
  // 값이 바뀌지 않는 변수는 매개변수로 전달
  //매개변수의 역할이 뚜렷하지 않을 때는 부정 관사(a/an)를 붙인다.
  let result = 0;
  switch (play_for(perf).type) {
    case "tragedy": //비극
      result = 40000;
      if (a_performance.audience > 30) {
        result += 1000 * (a_performance.audience - 30);
      }
      break;
    case "comedy": //희극
      result = 30000;
      if (a_performance.audience > 20) {
        result = 10000 + 500 * (a_performance.audience - 20);
      }
      result += 300 * a_performance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${play_for(perf).type}`);
  }
  return result;
}

// amount_for는 play 변수가 필요한데, 이는 a_performace에서 얻는다.
// 이럴땐 임시 변수 play를 질의함수로 바꾼다.
function play_for(a_performance) {
  return plays[a_performance.playID];
}
