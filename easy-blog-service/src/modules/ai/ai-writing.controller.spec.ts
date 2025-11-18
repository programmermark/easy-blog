import { Test, TestingModule } from '@nestjs/testing';
import { AIWritingController } from './ai-writing.controller';
import { AIService } from './ai.service';
import { TitleStyle } from './dto/ai-writing.dto';

describe('AIWritingController', () => {
  let controller: AIWritingController;
  let aiService: AIService;

  const mockAIService = {
    generateTitle: jest.fn(),
    generateSummary: jest.fn(),
    generateContent: jest.fn(),
    optimizeContent: jest.fn(),
    chat: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AIWritingController],
      providers: [
        {
          provide: AIService,
          useValue: mockAIService,
        },
      ],
    }).compile();

    controller = module.get<AIWritingController>(AIWritingController);
    aiService = module.get<AIService>(AIService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateTitle', () => {
    it('should generate title successfully', async () => {
      const dto = { content: 'test content' };
      const expectedTitle = 'Generated Title';
      mockAIService.generateTitle.mockResolvedValue(expectedTitle);

      const result = await controller.generateTitle(dto);

      expect(result).toEqual({ content: expectedTitle });
      expect(mockAIService.generateTitle).toHaveBeenCalledWith(
        dto.content,
        undefined,
      );
    });

    it('should generate title with style', async () => {
      const dto = { content: 'test content', style: TitleStyle.ATTRACTIVE };
      const expectedTitle = 'Attractive Title';
      mockAIService.generateTitle.mockResolvedValue(expectedTitle);

      const result = await controller.generateTitle(dto);

      expect(result).toEqual({ content: expectedTitle });
      expect(mockAIService.generateTitle).toHaveBeenCalledWith(
        dto.content,
        '吸引人',
      );
    });
  });

  describe('generateSummary', () => {
    it('should generate summary successfully', async () => {
      const dto = { content: 'test content', maxLength: 200 };
      const expectedSummary = 'Generated Summary';
      mockAIService.generateSummary.mockResolvedValue(expectedSummary);

      const result = await controller.generateSummary(dto);

      expect(result).toEqual({ content: expectedSummary });
      expect(mockAIService.generateSummary).toHaveBeenCalledWith(
        dto.content,
        dto.maxLength,
      );
    });
  });

  describe('generateContent', () => {
    it('should generate content successfully', async () => {
      const dto = {
        prompt: 'test prompt',
        context: 'test context',
      };
      const expectedContent = 'Generated Content';
      mockAIService.generateContent.mockResolvedValue(expectedContent);

      const result = await controller.generateContent(dto);

      expect(result).toEqual({ content: expectedContent });
      expect(mockAIService.generateContent).toHaveBeenCalledWith(
        dto.prompt,
        dto.context,
        undefined,
      );
    });
  });

  describe('optimizeContent', () => {
    it('should optimize content successfully', async () => {
      const dto = {
        content: 'test content',
        instruction: 'make it professional',
      };
      const expectedContent = 'Optimized Content';
      mockAIService.optimizeContent.mockResolvedValue(expectedContent);

      const result = await controller.optimizeContent(dto);

      expect(result).toEqual({ content: expectedContent });
      expect(mockAIService.optimizeContent).toHaveBeenCalledWith(
        dto.content,
        dto.instruction,
        undefined,
      );
    });
  });

  describe('continueWriting', () => {
    it('should continue writing successfully', async () => {
      const dto = { content: 'test content' };
      const mockResponse = {
        content: 'Continued content',
        model: 'qwen-plus',
        usage: { total_tokens: 100 },
      };
      mockAIService.chat.mockResolvedValue(mockResponse);

      const result = await controller.continueWriting(dto);

      expect(result).toEqual({ content: mockResponse.content });
      expect(mockAIService.chat).toHaveBeenCalled();
    });
  });

  describe('analyzeArticle', () => {
    it('should analyze article successfully', async () => {
      const dto = { content: 'test content', title: 'test title' };
      const mockResponse = {
        content: 'Analysis result',
        model: 'qwen-plus',
        usage: { total_tokens: 200 },
      };
      mockAIService.chat.mockResolvedValue(mockResponse);

      const result = await controller.analyzeArticle(dto);

      expect(result).toEqual({
        analysis: mockResponse.content,
        usage: mockResponse.usage,
      });
      expect(mockAIService.chat).toHaveBeenCalled();
    });
  });
});

