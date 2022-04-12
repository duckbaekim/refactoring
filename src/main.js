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
    const play = plays[perf.playID];
    console.log(play, "playplay", perf.playID);
    let this_amount = 0;

    switch (play.type) {
      case "tragedy": //비극
        this_amount = 40000;
        if (perf.audience > 30) {
          this_amount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy": //희극
        this_amount = 30000;
        if (perf.audience > 20) {
          this_amount = 10000 + 500 * (perf.audience - 20);
        }
        this_amount += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    // 포인트를 적립한다.
    volume_credits += Math.max(perf.audience - 30, 0);

    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volume_credits += Math.floor(perf.audience / 5);

    //청구 내역을 출력한다.
    result += ` ${play.name}: ${format(this_amount / 100)} (${
      perf.audience
    }석)\n`;
    total_amount += this_amount;
  }
  result += `총액: ${format(total_amount / 100)}\n`;
  result += `적립 포인트 : ${volume_credits}점\n`;
  return result;
}

// 리펙터링 지점
// 1. html 출력하는 기능 분리
// 2. 연극 장르와 공연료 정책에 따라 statement함수를 변경해야 한다.
