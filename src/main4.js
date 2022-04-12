// 계산 단계 분리
// 이전 단계는 반복문 쪼개기, 문장 슬라이드하기, 함수 추출하기, 변수 인라인 처리 등
// 구조적으로 코드를 보도록 정리했다.
// 이후 단계 쪼개기로 계산 단계와 포매팅 단계를 분리한다.

export function statement(invoice, plays) {
  //반복문 쪼개기 -> 반복문 분리시 성능 저하는 일어난다. 다만 읽기 좋은 코드를 위해 시행하는 경우도 있다.
  return render_plain_text(invoice, plays);
}

function render_plain_text(invoice, plays) {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  for (let perf of invoice.performances) {
    //청구 내역을 출력한다.
    result += ` ${play_for(perf).name}: ${usd(amount_for(perf) / 100)} (${
      perf.audience
    }석)\n`;
  }
  result += `총액: ${usd(total_amount())}\n`; //임시 변수였던 format을 usd함수 호출로 대체
  result += `적립 포인트 : ${total_volume_credits()}점\n`;
  return result;

  function total_amount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amount_for(perf);
    }
    return result;
  }

  function total_volume_credits() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volume_credits_for(perf);
    }
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
}
