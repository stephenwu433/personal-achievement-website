/** 压缩沙发只记录已给出的阶段结果、账号截图和脚本附件，不补未提供的成交或投放数据。 */

export const sofaHero = {
  index: '05',
  kicker: 'PROJECT ARCHIVE',
  title: ['压缩沙发', '海外 TikTok 内容增长'],
  english: 'COMPRESSED SOFA / TIKTOK B2B GROWTH',
  body: '把海外买家关心的装柜、运费、回弹、试单和工厂能力，转化为可拍摄、可复用、可承接询盘的 ToB 内容系统。',
  role: '脚本策划与内容增长',
  period: '项目阶段',
  panel: ['B2B CONTENT SYSTEM', 'CONTENT → INQUIRY → FOLLOW-UP'],
}

export const sofaSignals = {
  kicker: 'PROJECT SIGNALS',
  title: '项目阶段结果',
  stats: [
    { value: '已脱敏', label: '累计播放量' },
    { value: '已脱敏', label: '单条最高播放' },
    { value: '已脱敏', label: '海外询盘线索' },
    { value: '已脱敏', label: '短视频脚本' },
    { value: '已脱敏', label: '可复用模板' },
    { value: '已脱敏', label: '复盘后平均播放' },
  ],
  note: '项目历史内容与账号阶段数据，覆盖内容生产、播放表现和海外询盘沉淀。',
}

export const sofaDecisions = {
  kicker: 'FROM PRODUCT TO BUYER DECISION',
  title: '不是介绍沙发，\n而是回答采购决策问题',
  items: [
    { index: '01', title: '装柜与运费', body: '大件家具占柜，运输成本直接影响经销商利润空间。' },
    { index: '02', title: '回弹与质量', body: '压缩后能否快速回弹，是客户对质量和售后的核心担忧。' },
    { index: '03', title: '低风险试单', body: '买家不希望一次压过多库存，需要小批量、混柜和测试市场的路径。' },
    { index: '04', title: '产品与场景匹配', body: '单椅、组合沙发、沙发床与床垫，对应不同的渠道和销售场景。' },
    { index: '05', title: '工厂履约能力', body: '买家不仅看价格，也会判断源头工厂、打样、交期、定制和物流协同能力。' },
  ],
  close: '内容的任务，是在短时间内让海外买家看见“这款产品是否值得进入我的采购清单”。',
}

export const sofaSystem = {
  kicker: 'CONTENT SYSTEM',
  title: '从买家痛点到可拍摄脚本',
  flow: ['买家问题', '内容钩子', '产品 / 工厂证明', '评论与私信收口', '询盘识别与跟进'],
  tracks: [
    { index: 'A', title: '产品卖点线', body: '压缩省运费、回弹质量、展厅吸引力、组合销售、试单风险。' },
    { index: 'B', title: '工厂信任线', body: '源头直供、混柜能力、验厂、交期、装柜方案。' },
    { index: 'C', title: '询盘承接线', body: '从“评论区打 若干”到目录、选品、报价、物流和下一次沟通。' },
  ],
}

export const sofaEvidence = {
  kicker: 'ACCOUNT EVIDENCE',
  title: '内容矩阵示意',
  lead: '公开版只展示内容方向，原账号截图含身份、联系方式和业务数字，已从仓库移除。',
  shots: [
    {
      index: '01',
      title: '内容场景示意',
      body: '以产品、工厂和采购疑问组织内容。此图不是账号数据截图。',
      src: '/projects/sofa.webp',
    },
  ],
}

export const sofaScripts = {
  kicker: 'SCRIPT EVIDENCE',
  title: '可执行的 ToB 脚本资产',
  body: '将经销商与批发商关注的运费、回弹、试单、混柜、工厂能力与装柜方案，拆成可直接拍摄的中英双语口播脚本，并在每条内容中保留明确的咨询收口。',
  file: {
    kind: '脚本',
    title: 'ToB 口播脚本结构（公开版）',
    note: 'B2B hook + product proof + inquiry CTA',
  },
}

export const sofaWork = {
  kicker: 'WHAT I BUILT',
  title: '我的工作不是单条文案',
  items: [
    { index: '01', title: '买家问题建模', body: '将装柜、运费、回弹、试单与工厂能力，转译为海外采购者能够快速理解的内容问题。' },
    { index: '02', title: '双语脚本系统', body: '围绕产品线与工厂线组织脚本，统一钩子、证明、产品展示与咨询收口。' },
    { index: '03', title: '内容复盘机制', body: '以播放、互动、评论关键词和询盘路径作为复盘输入，持续调整选题优先级与脚本模板。' },
    { index: '04', title: '询盘承接逻辑', body: '将内容流量继续连接到目录、选品、报价、物流与后续沟通，避免内容只停留在曝光层。' },
  ],
  close: '项目重点：让内容、销售和客户跟进使用同一套买家决策逻辑。',
}
