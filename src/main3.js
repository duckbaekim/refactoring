export function statement(invoice, plays) {
  let total_amount = 0;
  let volume_credits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    volume_credits += volume_credits_for(perf);

    //청구 내역을 출력한다.
    result += ` ${play_for(perf).name}: ${format(amount_for(perf) / 100)} (${
      perf.audience
    }석)\n`;
    total_amount += amount_for(perf);
  }
  result += `총액: ${usd(total_amount)}\n`; //임시 변수였던 format을 함수 호출로 대체
  result += `적립 포인트 : ${volume_credits}점\n`;
  return result;
}

//누적되는 함수는 복제본 초기화 후  계산결과 반영
function volume_credits_for(a_performance) {
  let result = 0;
  result += Math.max(a_performance.audience - 30, 0);
  if ("comedy" === play_for(a_performance).type)
    result += Math.floor(a_performance.audience / 5);
  return result;
}

function amount_for(a_performance) {
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

function play_for(a_performance) {
  return plays[a_performance.playID];
}

function usd(a_number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(a_number / 100);
}
