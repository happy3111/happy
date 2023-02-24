import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ActionLogArgs } from './dto/action_log.args';
import { ActionLog } from './logging.entity';
import { LoggingService } from './logging.service';
import { Roles } from 'src/auth/roles.decorator';
@Resolver(() => ActionLog)
export class LoggingResolver {
  constructor(private readonly actionLogService: LoggingService) {}

  @Roles()
  @Query(() => ActionLog)
  async actionLog(@Args('id') id: string): Promise<ActionLog> {
    const actionLog = await this.actionLogService.findOne(id);
    if (!actionLog) {
      throw new NotFoundException(id);
    }
    return actionLog;
  }

  @Roles()
  @Query(() => [ActionLog])
  actionLogs(@Args() actionLogArgs: ActionLogArgs): Promise<ActionLog[]> {
    return this.actionLogService.findAll(actionLogArgs);
  }
}
