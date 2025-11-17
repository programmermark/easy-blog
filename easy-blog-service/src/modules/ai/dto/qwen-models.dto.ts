/**
 * 通义千问模型枚举
 * 参考文档：https://help.aliyun.com/zh/model-studio/getting-started/models
 */
export enum QwenModel {
  /**
   * 通义千问 Max
   * - 最强性能，适用于复杂任务
   * - 上下文窗口：262,144 tokens
   * - 适用场景：高质量内容生成、复杂推理任务
   */
  QWEN_MAX = 'qwen-max',

  /**
   * 通义千问 Plus（推荐用于智能文章助手）
   * - 性能与成本平衡
   * - 上下文窗口：1,000,000 tokens
   * - 适用场景：长篇文章生成、内容优化、日常写作任务
   */
  QWEN_PLUS = 'qwen-plus',

  /**
   * 通义千问 Turbo/Flash
   * - 高性价比，低时延
   * - 上下文窗口：1,000,000 tokens
   * - 适用场景：快速响应需求、实时对话、批量处理
   */
  QWEN_TURBO = 'qwen-turbo',
  QWEN_FLASH = 'qwen-flash',

  /**
   * 通义千问 Long
   * - 超长文档处理
   * - 上下文窗口：超长（具体以官方文档为准）
   * - 适用场景：超长文章处理、长文档摘要、长篇内容分析
   */
  QWEN_LONG = 'qwen-long',

  /**
   * 通义千问 Coder
   * - 专为工程化编码与工具调用设计
   * - 上下文窗口：1,000,000 tokens
   * - 适用场景：代码生成、代码分析、技术文档编写
   */
  QWEN_CODER = 'qwen-coder',

  /**
   * 通义千问 VL-Plus（视觉语言模型）
   * - 支持多模态输入（图片、文档、视频）
   * - 单图最大上下文：16,384 tokens
   * - 适用场景：图文内容生成、文档理解、视频分析
   */
  QWEN_VL_PLUS = 'qwen-vl-plus',

  /**
   * 通义千问 VL-Max（视觉语言模型）
   * - 旗舰级视觉推理性能
   * - 单图最大上下文：16,384 tokens
   * - 适用场景：高质量视觉内容理解、复杂视觉任务
   */
  QWEN_VL_MAX = 'qwen-vl-max',
}

/**
 * 模型分类
 */
export enum ModelCategory {
  /** 通用对话模型 */
  GENERAL = 'general',
  /** 视觉语言模型 */
  VISION = 'vision',
  /** 代码模型 */
  CODE = 'code',
  /** 长文本模型 */
  LONG_TEXT = 'long_text',
}

/**
 * 模型信息接口
 */
export interface ModelInfo {
  /** 模型名称 */
  name: QwenModel;
  /** 模型分类 */
  category: ModelCategory;
  /** 上下文窗口大小（tokens） */
  contextWindow: number | string;
  /** 适用场景描述 */
  useCases: string[];
  /** 性能特点 */
  features: string[];
}

/**
 * 模型信息映射表
 */
export const MODEL_INFO_MAP: Record<QwenModel, ModelInfo> = {
  [QwenModel.QWEN_MAX]: {
    name: QwenModel.QWEN_MAX,
    category: ModelCategory.GENERAL,
    contextWindow: 262144,
    useCases: ['高质量内容生成', '复杂推理任务', '专业写作'],
    features: ['最强性能', '高质量输出', '复杂任务处理'],
  },
  [QwenModel.QWEN_PLUS]: {
    name: QwenModel.QWEN_PLUS,
    category: ModelCategory.GENERAL,
    contextWindow: 1000000,
    useCases: ['长篇文章生成', '内容优化', '日常写作', '文章摘要', '标题生成'],
    features: ['性能与成本平衡', '超长上下文', '适合写作场景'],
  },
  [QwenModel.QWEN_TURBO]: {
    name: QwenModel.QWEN_TURBO,
    category: ModelCategory.GENERAL,
    contextWindow: 1000000,
    useCases: ['快速响应需求', '实时对话', '批量处理'],
    features: ['低时延', '高性价比', '快速响应'],
  },
  [QwenModel.QWEN_FLASH]: {
    name: QwenModel.QWEN_FLASH,
    category: ModelCategory.GENERAL,
    contextWindow: 1000000,
    useCases: ['快速响应需求', '实时对话', '批量处理'],
    features: ['低时延', '高性价比', '快速响应'],
  },
  [QwenModel.QWEN_LONG]: {
    name: QwenModel.QWEN_LONG,
    category: ModelCategory.LONG_TEXT,
    contextWindow: '超长',
    useCases: ['超长文章处理', '长文档摘要', '长篇内容分析'],
    features: ['超长上下文', '长文本处理', '文档分析'],
  },
  [QwenModel.QWEN_CODER]: {
    name: QwenModel.QWEN_CODER,
    category: ModelCategory.CODE,
    contextWindow: 1000000,
    useCases: ['代码生成', '代码分析', '技术文档编写'],
    features: ['代码理解', '工具调用', '工程化编码'],
  },
  [QwenModel.QWEN_VL_PLUS]: {
    name: QwenModel.QWEN_VL_PLUS,
    category: ModelCategory.VISION,
    contextWindow: 16384,
    useCases: ['图文内容生成', '文档理解', '视频分析'],
    features: ['多模态输入', '图片理解', '文档处理'],
  },
  [QwenModel.QWEN_VL_MAX]: {
    name: QwenModel.QWEN_VL_MAX,
    category: ModelCategory.VISION,
    contextWindow: 16384,
    useCases: ['高质量视觉内容理解', '复杂视觉任务'],
    features: ['旗舰级视觉推理', '高质量输出', '复杂视觉任务'],
  },
};

/**
 * 获取模型信息
 */
export function getModelInfo(model: QwenModel): ModelInfo {
  return MODEL_INFO_MAP[model];
}

/**
 * 根据分类获取模型列表
 */
export function getModelsByCategory(category: ModelCategory): QwenModel[] {
  return Object.values(QwenModel).filter(
    (model) => MODEL_INFO_MAP[model].category === category,
  );
}

/**
 * 智能文章助手推荐模型
 * 根据不同的使用场景推荐合适的模型
 */
export const WritingAssistantModelRecommendation = {
  /** 日常文章生成（推荐） */
  DEFAULT: QwenModel.QWEN_PLUS,
  /** 高质量文章生成 */
  HIGH_QUALITY: QwenModel.QWEN_MAX,
  /** 快速响应场景 */
  FAST: QwenModel.QWEN_TURBO,
  /** 超长文章处理 */
  LONG_ARTICLE: QwenModel.QWEN_LONG,
  /** 技术文章/代码相关 */
  TECHNICAL: QwenModel.QWEN_CODER,
} as const;

